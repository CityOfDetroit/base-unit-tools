import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMediaQuery } from '../components/mediaQuery';
import apps from '../data/apps';
import logo from '../images/logo.png';
import SiteFooter from './SiteFooter';


const SiteWrapper = ({ session, setSession, children }) => {
  const location = useLocation()

  let isDesktop = useMediaQuery('(min-width: 769px)')
  console.log(isDesktop)

  return (
    <>
      <>
        <header className="flex items-center justify-between">
          <img src={logo} className="h-10 m-2" alt={"City logo"} />
          <h1 className="w-full font-black">
            Base Unit Tools
                </h1>
        </header>
        <nav className="">
          {isDesktop ?
            <ul className="flex items-center justify-start">
              {Object.keys(apps).map((k, i) => {
                if ((apps[k].private && session) || !apps[k].private) {
                  return (
                  <Link key={k} to={`.${apps[k].url}`}>
                    <li className={`p-3 px-4`}
                      style={location.pathname === apps[k].url ? { background: "#feb70d" } : {}}
                    >
                      <FontAwesomeIcon icon={apps[k].icon} className="mr-2" />
                      <span className={location.pathname === apps[k].url ? 'font-bold text-gray-900' : `text-gray-700`}>{apps[k].name}</span>
                    </li>
                  </Link>
                )
                }
                else {return null;}
              })}
            </ul>
            :
            <div className="flex items-center justify-around text-xs">
              {Object.keys(apps).map((k, i) => {
                if ((apps[k].private && session) || (!apps[k].private)) {return (
                  <Link key={k} to={`.${apps[k].url}`}>
                    <div
                      className="py-2 px-3"
                      style={location.pathname === apps[k].url ? { background: "#feb70d" } : {}}
                    >
                      <FontAwesomeIcon icon={apps[k].icon} className="" />
                      {location.pathname === apps[k].url ? <span className="ml-2">{apps[k].name}</span> : ``}
                    </div>
                  </Link>
                )} else { return null; }
              })}
            </div>
          }
        </nav>
      </>
      {children}
      <SiteFooter />
    </>
  )
}

export default SiteWrapper;