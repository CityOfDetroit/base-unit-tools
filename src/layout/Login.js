import React, { useState } from "react";
import { UserSession } from "@esri/arcgis-rest-auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faSignInAlt,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button";

export const Login = ({ session, setSession, setLogin }) => {
  const [creds, setCreds] = useState({ user: "", pass: "" });
  const [error, setError] = useState(null);

  return (
    <section className="text-sm w-full md:w-1/2 p-6 bg-gray-100 mt-0 md:mt-12 md:h-96">
      <h2 className="text-sm flex items-center justify-between">
        {session
          ? `Logged in as ${session.username}`
          : "Log in to ArcGIS Online"}
        <FontAwesomeIcon icon={faWindowClose} onClick={() => setLogin(false)} />
      </h2>

      {!session && (
        <p className="text-sm py-2">
          If you are a City of Detroit employee, log in for additional tools and
          options.
        </p>
      )}
      {!session && (
        <>
          <p className="text-sm py-2">
            Your username will generally end with{" "}
            <span className="font-bold">_detroitmi</span>. Your username is case-sensitive.
          </p>
          <p className="py-2">
            <a href="https://detroitmi.maps.arcgis.com/sharing/rest/oauth2/authorize?client_id=arcgisonline&display=default&response_type=token&state=%7B%22portalUrl%22%3A%22https%3A%2F%2Fdetroitmi.maps.arcgis.com%22%2C%22useLandingPage%22%3Atrue%7D&expiration=20160&locale=en-us&redirect_uri=https%3A%2F%2Fdetroitmi.maps.arcgis.com%2Fhome%2Faccountswitcher-callback.html&force_login=true&hideCancel=true&showSignupOption=true&canHandleCrossOrgSignIn=true&signuptype=esri&redirectToUserOrgUrl=true">
              Forgotten your password? You can reset it at this link.
            </a>
          </p>
        </>
      )}
      {!session && (
        <div className="my-2">
          <label
            htmlFor="username"
            className="flex items-center justify-between font-bold text-base"
          >
            Username
            <input
              className="p-2 w-3/4 my-2 text-sm"
              name="username"
              type="text"
              value={creds.user}
              onChange={(e) =>
                setCreds({ user: e.target.value, pass: creds.pass })
              }
            />
          </label>
          <label
            className="flex items-center justify-between font-bold text-base"
            htmlFor="password"
          >
            Password
            <input
              className="p-2 w-3/4 my-2 text-sm"
              type="password"
              value={creds.pass}
              onChange={(e) =>
                setCreds({ pass: e.target.value, user: creds.user })
              }
            />
          </label>
        </div>
      )}
      {error && (
        <div className="px-8 py-4 my-8 bg-red-200 flex items-center justify-between">
          <span className="">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
            {error.response.error.message} ({error.response.error.details[0]})
          </span>
          <FontAwesomeIcon
            icon={faWindowClose}
            className="text-xl"
            onClick={() => setError(null)}
          />
        </div>
      )}

      <div className="flex items-center justify-around">
      <Button
        className="px-2 md:px-8 py-1 md:py-4 mt-4 w-1/2 justify-center"
        active={creds.user !== "" && creds.pass !== ""}
        onClick={() => {
          let userSession = new UserSession({
            username: creds.user,
            password: creds.pass,
          });
          userSession
            .getToken("https://detroitmi.maps.arcgis.com/arcgis/rest/sharing")
            .then((d) => {
              setSession(userSession);
              setLogin(false);
            })
            .catch((err) => setError(err));
        }}
        icon={faSignInAlt}
        text="Log in"
      />
      </div>
    </section>
  );
};

export default Login;
