import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import SiteSidebar from '../layout/SiteSidebar';
import { apps } from '../data/apps';
import Login from '../layout/Login';

let toolGridStyle = { display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))`, gridAutoRows: 150, gridGap: '.75rem' }

const BaseUnitTools = ({ session, setSession }) => {

  return (
    <>
      <SiteSidebar title="Home">
        <section className="sidebar-section">
          <h2 className="mb-2">Welcome to the Base Units Tools site</h2>
          <p className="mb-2">
            Base Units are the fundamental units of measurement we use to describe our city.
          </p>
          <p>
            <a href="https://base-units-detroitmi.hub.arcgis.com/">Learn more about them here</a>.
          </p>
        </section>
        <Login {...{ session, setSession }} />
      </SiteSidebar>
      <main>
        <div style={toolGridStyle}>
          {Object.values(apps).slice(1,).map(a => {

            if (session || (!session && !a.private)) {

              return (
                <div className="bg-gray-200 p-4" key={a.name}>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={a.icon} size="2x" className="mr-3" />
                    <Link to={`.${a.url}`}>
                      <p className="text-xl font-bold">{a.name}</p>
                    </Link>
                  </div>
                  <p className="my-4">{a.description}</p>
                  {/* <h4 className="text-sm">Common scenarios</h4>
                  <ul className="list-disc ml-4">
                    {a.questions.map(q => <li className="text-sm" key={q}>"{q}"</li>)}
                  </ul> */}
                </div>
              )
            }
            else { return; }
          })}
        </div>
      </main>
    </>
  )
}

export default BaseUnitTools;