// src/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";
import esriId from "@arcgis/core/identity/IdentityManager";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [token, setToken] = useState(null);
  const [groups, setGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);

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
        setGroupsLoading(false);
      })
      .catch(() => {
        setGroups([]);
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
      });
  }, []);

  const getCurrentUser = () => {
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
        // navigate to home page

        navigat

      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSignOut = () => {
    esriId.destroyCredentials();
    setIsAuthenticated(false);
    setUsername("");
    setToken(null);
    setGroups([]);
    setGroupsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        username,
        groups,
        groupsLoading,
        isInGroup,
        handleSignIn,
        handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
