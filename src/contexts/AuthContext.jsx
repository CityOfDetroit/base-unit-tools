// src/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";
import esriId from "@arcgis/core/identity/IdentityManager";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const portalUrl = "https://detroitmi.maps.arcgis.com";

  useEffect(() => {
    const info = new OAuthInfo({
      // appId: import.meta.env.VITE_APP_ID,
      appId: `0baTjvsIAAccckbL`,
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
      });
  }, []);

  const getCurrentUser = () => {
    esriId
      .getCredential(portalUrl + "/sharing")
      .then((credentials) => {
        setUsername(credentials.userId);
      })
      .catch((error) => {
        console.error(error);
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
    setIsAuthenticated(false);
    setUsername("");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, username, handleSignIn, handleSignOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
