import {
  faBars,
  faSignInAlt,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../images/logo_small.png";
import { Login } from "./Login";
import apps from "../data/apps";
import { useState } from "react";
import AnimateHeight from "react-animate-height";
import Link from 'next/link';
import Image from 'next/image'

const SiteHeader = ({
  session,
  setSession,
  login,
  setLogin,
  currentApp,
  children,
}) => {
  let [open, setOpen] = useState(false);

  if (!login) {
    return (
      <header>
        <div
          className="flex items-center justify-between h-14"
          style={{ 
            borderBottom: open ? `8px solid rgba(254, 183, 13, 0.50)` : `8px solid rgb(254, 183, 13)`,
          }}
        >
          <Image src={logo} alt={"City logo"} height={45} width={40} />
          <h1 className={open ? "w-full font-black text-base md:text-xl ml-1 -mb-1 opacity-50" : "w-full font-black  text-base md:text-xl ml-1 -mb-1"}>
            Base Unit Tools
          </h1>
          <div className="flex items-center" onClick={() => setOpen(!open)}>
            <FontAwesomeIcon
              icon={faBars}
              className="mr-3 text-xl md:text-2xl hover:text-gray-500"
              style={{cursor: "pointer"}}
            />
          </div>
        </div>
        <AnimateHeight duration={150} height={open ? "auto" : 0}>
          <div
            className={
              session
                ? "w-100 flex items-center justify-between bg-blue-100 py-1 md:py-1 px-2 md:px-4 text-xs md:text-sm"
                : "w-100 flex items-center justify-between bg-red-100 py-1 md:py-1 px-2 md:px-4 text-xs md:text-sm"
            }
            onClick={() => !session && setLogin(true)}
          >
            <span className="leading-none text-gray-700">
              {session ? (
                <div>
                  You are logged in as: <b>{session.username}</b>
                </div>
              ) : (
                `Sign in with your ArcGIS Online account.`
              )}
            </span>
            <span
              className="leading-none text-gray-500 ml-2 flex items-center font-bold justify-around"
              onClick={() => session && setSession(null)}
            >
              {session ? `Log out` : `Log in`}
              <FontAwesomeIcon
                icon={session ? faSignOutAlt : faSignInAlt}
                className="text-xl md:text-2xl ml-2 hover:text-black"
                style={{cursor: "pointer"}}
              />
            </span>
          </div>
          {Object.keys(apps).map((app) => {
            if (session || !session && !apps[app].private) {
              return (
                <div className="flex items-center bg-gray-100 py-3 border-b-2 border-gray-200 hover:cursor-pointer hover:bg-gray-200 hover:font-extrabold" key={apps[app].name}>
                  <div className="w-12 flex items-center justify-around">
                    <FontAwesomeIcon
                      icon={apps[app].icon}
                      className="mx-3 text-xl h-6"
                    />
                  </div>
                  <Link href={apps[app].url}>
                    <h2 className="text-sm md:text-lg">{apps[app].name}</h2>
                  </Link>
                </div>
              );
            }
            else {
              return;
            }
          })}
        </AnimateHeight>
      </header>
    );
  }

  if (login) {
    return (
      <div className="absolute w-full h-3/4 z-20 bg-gray-800 bg-opacity-90 flex justify-around">
        <Login {...{ session, setSession, setLogin }} />
      </div>
    );
  }
};

export default SiteHeader;
