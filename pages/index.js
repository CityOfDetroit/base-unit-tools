import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import { apps } from "../src/data/apps";
import SiteSidebar from "../src/layout/SiteSidebar";

let toolGridStyle = {
  display: "grid",
  gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))`,
  gridAutoRows: 150,
  gridGap: ".75rem",
};

function IndexPage(props) {
  let { session, setSession, login, setLogin } = props;
  return (
    <>
      <SiteSidebar title="Home">
        <section className="sidebar-section">
          <h2 className="mb-2">Welcome to the Base Units Tools site</h2>
          <p className="mb-2">
            Base Units are the fundamental units of measurement we use to describe our city.
          </p>
          <p>
            <a href="https://base-units-detroitmi.hub.arcgis.com/">
              Learn more about them at our Hub Site
            </a>
            .
          </p>
        </section>
      </SiteSidebar>
      <main>
        <section className="sidebar-section my-2">
          <h2>Base unit tools</h2>
          <p>List of base unit tools</p>
        </section>
        <div style={toolGridStyle}>
          {Object.values(apps)
            .slice(1)
            .map((a) => {
              if (session || (!session && !a.private)) {
                return (
                  <div className="bg-gray-200 p-4" key={a.name}>
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={a.icon} size="2x" className="mr-3" />
                      <Link href={`.${a.url}`}>
                        <p className="text-xl font-bold">{a.name}</p>
                      </Link>
                    </div>
                    <p className="my-4">{a.description}</p>
                  </div>
                );
              } else {
                return;
              }
            })}
        </div>
      </main>
    </>
  );
}

export default IndexPage;
