import React, { useState } from 'react';
import { UserSession } from '@esri/arcgis-rest-auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faSignInAlt, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import Button from '../components/Button'

export const Login = ({ session, setSession, setLogin }) => {

  const [creds, setCreds] = useState({ user: '', pass: '' });
  const [error, setError] = useState(null)

  return (
    <section className="text-sm w-1/2 p-6 bg-gray-100 mt-12 h-96">
      <h2 className="text-base flex items-center justify-between">
        {session ? 
          `Logged in as ${session.username}` 
          : 'Log in to ArcGIS Online'
        } 
        <FontAwesomeIcon icon={faWindowClose} onClick={() => setLogin(false)} />
      </h2>
      
      {!session && <span className="text-sm">If you are a City of Detroit employee, log in for additional tools and options.</span>}
      {!session &&
        <div className="my-2">
          <label htmlFor="username" className="flex items-center justify-between text-sm">Username
            <input
              className="p-2 w-3/4 my-2 text-sm"
              name="username"
              type="text"
              value={creds.user}
              onChange={(e) => setCreds({ user: e.target.value, pass: creds.pass })} />
          </label>
          <label className="flex items-center justify-between text-sm" htmlFor="password">Password
            <input
              className="p-2 w-3/4 my-2 text-sm"
              type="password"
              value={creds.pass}
              onChange={(e) => setCreds({ pass: e.target.value, user: creds.user })} />
          </label>
        </div>}
      {error &&
      <div className="px-8 py-4 my-8 bg-red-200 flex items-center justify-between">
        <span className="">
          <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
         {error.response.error.message} ({error.response.error.details[0]})
        </span>
        <FontAwesomeIcon icon={faWindowClose} className="text-xl" onClick={() => setError(null)} />
      </div>
      }

        <Button
        className="px-8"
          active={creds.user !== '' && creds.pass !== ''}
          onClick={() => {
            let userSession = new UserSession({
              username: creds.user,
              password: creds.pass
            });
            userSession.getToken(
              "https://detroitmi.maps.arcgis.com/arcgis/rest/sharing"
            ).then(d => {
              console.log(d)
              setSession(userSession);
              setLogin(false)
            })
            .catch(err => setError(err));
          }} 
          icon={faSignInAlt}
          text='Log in'
          />
    </section>
  );
};

export default Login;
