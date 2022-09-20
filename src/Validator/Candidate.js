import { faExternalLinkAlt, faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import IssueReporter from "../../src/components/IssueReporter";

let types = {
  PointAddress: {
    name: `address point`,
    description: `it's represented in our database and linked to other base units.`,
  },
  Subaddress: {
    name: `unit address point`,
    description: `it's represented in our database, linked to other base units, and has a corresponding primary address.`,
  },
  StreetAddress: {
    name: `street centerline address`,
    description: `it's not represented in our database, but we can locate it along a street.`,
  },
  StreetInt: {
    name: `street centerline intersection`,
    description: `it represents the point where two streets in our database meet.`,
  },
};

const Candidate = ({ candidate, session }) => {
  let [addr, city, zip] = candidate.properties.address?.split(",");
  let [lat, lng] = [candidate.properties.Y, candidate.properties.X];

  let clicked = {};

  if (
    candidate.properties.Addr_type === "PointAddress" &&
    candidate.properties.address_id > 0
  ) {
    clicked = {
      type: "addresses",
      id: candidate.properties.address_id,
    };
  }

  let { name, description } = types[candidate.properties.Addr_type];

  let externalLinks = {
    "Google Maps": `http://www.google.com/maps/place/${lat},${lng}`,
    "Detroit Street View/Mapillary": `https://www.mapillary.com/app/?lat=${lat}&lng=${lng}&z=19.5&username%5B%5D=codgis`
  }

  return (
    <div>
      <section className="sidebar-section flex items-start justify-between">
        <h2 className="text-lg md:text-xl">{addr}</h2>
        <div className="w-1/2 px-2 text-right text-gray-700">
          <p className="text-base leading-tight">
            type: <span className="font-semibold">{name}</span>
          </p>
          {/* <p className="leading-tight text-sm">{description}</p> */}
        </div>
      </section>

      <section className="flex items-center gap-4 bg-gray-100 text-sm p-3 bg-gray-200">
        <ul className="flex items-center flex-row gap-4 font-thin">
          {Object.keys(externalLinks).map(k => (
            <li className="text-gray-600">
              <a href={externalLinks[k]} target="_blank">
                {k}
              <FontAwesomeIcon className="text-gray-400 ml-1 text-xs" icon={faExternalLinkAlt} />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <IssueReporter
        session={session}
        geocoded={{ features: [candidate] }}
        clicked={clicked}
      />
    </div>
  );
};

export default Candidate;
