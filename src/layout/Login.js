import React, { useState } from 'react';
import { UserSession } from '@esri/arcgis-rest-auth';

export const Login = ({ session, setSession, setLogin }) => {

  const [creds, setCreds] = useState({ user: '', pass: '' });

  return (
    <section className="sidebar-section text-sm">
      <h2 className="text-base">{session ? `Logged in as ${session.username}` : 'Log in to ArcGIS Online'}</h2>
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
      {session ?
        <button
          className='btn-enabled my-2'
          onClick={() => setSession(null)}>
          Log out
        </button>
        :
        <button
          className={creds.user !== '' && creds.pass !== '' ? 'btn-enabled my-1 text-sm' : 'btn-disabled my-1 text-sm'}
          onClick={() => {
            let userSession = new UserSession({
              username: creds.user,
              password: creds.pass
            });

            userSession.getToken(
              "https://detroitmi.maps.arcgis.com/arcgis/rest/sharing"
            ).then(d => {
              setSession(userSession);
              setLogin(false)
            });
          }}>
          Log in
    </button>}
    </section>
  );
};

export default Login;
