import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMediaQuery } from '../components/mediaQuery';
import apps from '../data/apps';
import SiteFooter from './SiteFooter';
import SiteHeader from './SiteHeader';


const SiteWrapper = ({ session, setSession, children }) => {

  // get the current browser URL to highlight the correct nav entry
  const location = useLocation()

  // return true or false based on screen width
  let isDesktop = useMediaQuery('(min-width: 769px)')

  return (
    <>
      <>
        <SiteHeader {...{session}} />
        <nav className="">
          {isDesktop ?
            // desktop nav
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
            // hacky mobile navigation
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