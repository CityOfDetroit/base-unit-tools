import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import logo from '../images/logo.png';
import {Login} from './Login';

const SiteHeader = ({ session, setSession, login, setLogin }) => {

  if (!login) {
    return (
      <header>
        <div className="flex items-center justify-between">
          <img src={logo} className="h-10 mt-2 ml-2 mr-2" alt={"City logo"} />
          <h1 className="w-full font-black">
            Base Unit Tools
        </h1>
        </div>

        {session ?
          // If user is logged in, display this div
          <div className="w-100 flex ml-3 justify-between">
            <span className="leading-tight  text-sm text-gray-500 font-semibold">
              logged in as: <b>{session.username}</b>
            </span>
            <span className="leading-tight text-sm text-gray-500 font-semibold" onClick={() => setSession(null)}>
              <FontAwesomeIcon icon={faSignOutAlt} />
            </span>
          </div>
          :
          // Else, this div.
          <div className="w-100 text-right -mt-2">
            <span className="leading-tight  text-sm text-gray-500 font-semibold" onClick={() => setLogin(true)}>
              Login here
          </span>
          </div>
        }
      </header>
    )
  }

  if(login) {
    return (
      <div style={{height: '100vh', width: '100vw', background: 'red', position: 'absolute', zIndex: 5}}>
        <Login {...{session, setSession, setLogin}}/>
      </div>
      )
  }

}

export default SiteHeader;