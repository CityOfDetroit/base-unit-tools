import { faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import logo from '../images/logo.png';
import { Login } from './Login';

const SiteHeader = ({ session, setSession, login, setLogin }) => {

  if (!login) {
    return (
      <header>
        <div className="flex items-center justify-between">
          <img src={logo} className="h-12 mt-1 ml-1 mr-1" alt={"City logo"} />
          <h1 className="w-full font-black">
            Base Unit Tools
          </h1>
        </div>

        {session ?
          // If user is logged in, display this div
          <div className="w-100 flex flex-row-reverse ml-3 items-center -mt-1">
            <span className="leading-none text-base text-gray-500 font-base ml-2" onClick={() => setSession(null)}>
              <FontAwesomeIcon icon={faSignOutAlt} />
            </span>
            <span className="leading-none text-sm text-gray-500 font-base">
              logged in as: <b>{session.username}</b>
            </span>
          </div>
          :
          // Else, this div.
          <div className="w-100 flex flex-row-reverse ml-3 items-center -mt-1" onClick={() => setLogin(true)}>
            <span className="leading-none text-base text-gray-500 font-base ml-2" >
              <FontAwesomeIcon icon={faSignInAlt} />
            </span>
            <span className="leading-none text-sm text-gray-500 font-base">
              Log in to ArcGIS Online
            </span>
          </div>

        }
      </header>
    )
  }

  if (login) {
    return (
      <div className="absolute w-full h-3/4 z-20 bg-gray-800 bg-opacity-90 flex justify-around">
        <Login {...{ session, setSession, setLogin }} />
      </div>
    )
  }

}

export default SiteHeader;