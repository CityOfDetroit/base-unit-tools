// src/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";
import esriId from "@arcgis/core/identity/IdentityManager";

const AuthContext = createContext();

// The ArcGIS sign-in is kept in sessionStorage (this tab only) unless "keep me signed in" was ticked
// on the AGO page, so every link opened in a new tab went back to /login. Move it to localStorage,
// which IdentityManager also reads. Moved, not copied: when both hold a valid copy it revokes one,
// and both copies share the same refresh token. Only a finished sign-in moves; one still waiting on
// its OAuth redirect has to stay where IdentityManager left it.
const OAUTH_KEY = "esriJSAPIOAuth"; // @arcgis/core identity/OAuthCredential.js
const keepSignIn = () => {
  try {
    const v = sessionStorage.getItem(OAUTH_KEY);
    if (v && /"(refreshToken|token)":"/.test(v)) {
      localStorage.setItem(OAUTH_KEY, v);
      sessionStorage.removeItem(OAUTH_KEY);
    }
  } catch {}
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // false until the stored sign-in has been checked, so protected routes don't bounce to /login first
  const [authChecked, setAuthChecked] = useState(false);
  const [username, setUsername] = useState("");
  const [token, setToken] = useState(null);
  const [groups, setGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [orgId, setOrgId] = useState(null);

  const portalUrl = "https://detroitmi.maps.arcgis.com";

  // fetch the signed-in user's group memberships
  const fetchGroups = (userId, userToken) => {
    setGroupsLoading(true);
    const url = `${portalUrl}/sharing/rest/community/users/${encodeURIComponent(
      userId
    )}?f=json&token=${userToken}`;
    return fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setGroups(Array.isArray(data?.groups) ? data.groups : []);
        setOrgId(data?.orgId ?? null);
        setGroupsLoading(false);
      })
      .catch(() => {
        setGroups([]);
        setOrgId(null);
        setGroupsLoading(false);
      });
  };

  const isInGroup = (groupId) => groups.some((g) => g.id === groupId);

  useEffect(() => {
    const info = new OAuthInfo({
      // appId: import.meta.env.VITE_APP_ID,
      appId: `0baTjvsIAAccckbL`,
      // without this, OAuthInfo defaults to https://www.arcgis.com and users
      // land on Esri's generic sign-in chooser instead of the org's SSO page
      portalUrl,
      popup: false,
    });

    keepSignIn();
    esriId.registerOAuthInfos([info]);

    esriId
      .checkSignInStatus(portalUrl + "/sharing")
      .then(() => {
        setIsAuthenticated(true);
        getCurrentUser();
      })
      .catch(() => {
        setIsAuthenticated(false);
        setGroups([]);
        setGroupsLoading(false);
      })
      .finally(() => setAuthChecked(true));
  }, []);

  const getCurrentUser = () => {
    keepSignIn();
    setGroupsLoading(true);
    esriId
      .getCredential(portalUrl + "/sharing")
      .then((credentials) => {
        setUsername(credentials.userId);
        setToken(credentials.token);
        return fetchGroups(credentials.userId, credentials.token);
      })
      .catch((error) => {
        console.error(error);
        setGroups([]);
        setGroupsLoading(false);
      });
  };

  const handleSignIn = () => {
    esriId
      .getCredential(portalUrl)
      .then(() => {
        setIsAuthenticated(true);
        getCurrentUser();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSignOut = () => {
    esriId.destroyCredentials();
    try {
      localStorage.removeItem(OAUTH_KEY);
    } catch {}
    setIsAuthenticated(false);
    setUsername("");
    setToken(null);
    setGroups([]);
    setOrgId(null);
    setGroupsLoading(false);
  };

  // City of Detroit ArcGIS org; netlify/functions/nearmap.mjs does the same check server-side
  const isCityEmployee = isAuthenticated && orgId === "qvkbeam7Wirps6zC";

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authChecked,
        token,
        username,
        groups,
        groupsLoading,
        isInGroup,
        isCityEmployee,
        handleSignIn,
        handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
