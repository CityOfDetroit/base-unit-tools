import { faExternalLinkAlt, faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import IssueReporter from "../../src/components/IssueReporter";
import GeocodeCandidateMap from "../maps/GeocodeCandidateMap";
import { CategoryItem, UnitCategory } from "../../src/components/UnitCategory";
import Link from "next/link";
let types = {
  PointAddress: {
    name: `address point`,
    description: `it's represented in our database and linked to other base units.`,
  },
  Subaddress: {
    name: `address point/subunit`,
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
  let addr = candidate.properties.StAddr;
  let subaddr = candidate.properties.SubAddr;
  let [lat, lng] = [candidate.properties.Y, candidate.properties.X];

  let clicked = {};

  if (candidate.properties.Addr_type === "PointAddress" && candidate.properties.address_id > 0) {
    clicked = {
      type: "addresses",
      id: candidate.properties.address_id,
    };
  }

  let { name, description } = types[candidate.properties.Addr_type];

  let { address_id, building_id, parcel_id, street_id } = candidate.properties;

  let candidateData = {
    "Base unit links": {
      Address: (
        <a href={`/map?id=${address_id}&type=addresses`} target="_blank">
          {address_id}
        </a>
      ),
      Building: (
        <a href={`/map?id=${building_id}&type=buildings`} target="_blank">
          {building_id}
        </a>
      ),
      Parcel: <a href={`/map?id=${parcel_id}&type=parcels`}>{parcel_id}</a>,
      Street: <a href={`/map?id=${street_id}&type=streets`}>{street_id}</a>,
    },
    "External links": {
      "Google Maps": (
        <a href={`http://www.google.com/maps/place/${lat},${lng}`} target="_blank">
          Link
        </a>
      ),
      "Detroit Street View/Mapillary": (
        <a
          href={`https://www.mapillary.com/app/?lat=${lat}&lng=${lng}&z=19.5&username%5B%5D=codgis`}
          target="_blank"
        >
          Link
        </a>
      ),
    },
  };

  if (candidate.properties.Addr_type !== "PointAddress") {
    delete candidateData["Base unit links"];
  }

  return (
    <div>
      <div className="p-2 w-full flex items-center justify-between px-4 bg-gray-300">
        <h2>
          {addr} {subaddr}
        </h2>
        <h3>{name}</h3>
      </div>

      <div className="sidebar-section grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
        {Object.keys(candidateData).map((category, idx) => {
          return (
            <>
              <UnitCategory key={category} categoryName={category}>
                {Object.keys(candidateData[category]).map((column, idx) => (
                  <CategoryItem
                    column={column}
                    value={candidateData[category][column]}
                    borderBottom={Object.keys(candidateData[category]).length - 1 > idx}
                  />
                ))}
              </UnitCategory>
              {idx === 0 && <GeocodeCandidateMap candidate={candidate} />}
            </>
          );
        })}
      </div>

      <IssueReporter session={session} geocoded={{ features: [candidate] }} clicked={clicked} />
    </div>
  );
};

export default Candidate;
