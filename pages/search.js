import { geocode, suggest } from "@esri/arcgis-rest-geocoding";
import { faCheckSquare, faChevronRight, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import AppHeader from "../src/components/AppHeader";
import Button from "../src/components/Button";
import apps from "../src/data/apps";
import { geocoders, useGeocoder } from "../src/hooks/useGeocoder";
import SiteSidebar from "../src/layout/SiteSidebar";
import parse from "../src/parser.js";
import Candidate from "../src/Validator/Candidate";
import IssueReporterAddress from "../src/components/IssueReporterAddress";

const Validator = ({ session, setSession, login, setLogin }) => {
  let [value, setValue] = useState("");

  let [geocodeValue, setGeocodeValue] = useState(null);
  console.log(geocodeValue);
  let [data, resultType] = useGeocoder(geocodeValue);

  let [suggestions, setSuggestions] = useState([]);

  let { results, applied } = parse(value);

  let displayFields = [
    ["housenum", "House number"],
    ["direction", "Street direction"],
    ["streetname", "Street name"],
    ["streettype", "Street type"],
    ["unittype", "Unit type"],
    ["unitnum", "Unit number"],
  ];

  let introduction = (
    <>
      <p>Use this tool to find a single address and see more information about it.</p>
    </>
  );

  useEffect(() => {
    if (value) {
      suggest(value, {
        endpoint: geocoders.point,
      }).then((r) => {
        setSuggestions(r.suggestions);
      });
    }
  }, [value]);

  return (
    <>
      <AppHeader app={apps.search} introduction={introduction} />
      <SiteSidebar title="Search">
        <section className="sidebar-section mb-2">
          <h2>Address to search</h2>
          <div className="flex justify-between p-2">
            <input
              className="p-4 w-full text-lg"
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setGeocodeValue(null);
              }}
            />
            <Button
              icon={faSearch}
              onClick={() => setGeocodeValue(value)}
              text="Search"
              className=""
            />
          </div>
          {suggestions.length > 0 && !geocodeValue && (
            <section className="bg-gray-200 px-2 py-1 mx-2">
              {suggestions.map((s) => (
                <div
                  key={s.text}
                  className="bg-grey-200 flex items-center justify-start text-sm py-1 hover:text-gray-500 text-gray-700 cursor-pointer"
                  onClick={() => {
                    setValue(s.text.split(",")[0]);
                    setSuggestions([]);
                    setGeocodeValue(s.text.split(",")[0]);
                  }}
                >
                  <span className="text-sm ">
                    <FontAwesomeIcon icon={faChevronRight} className="mr-2" /> {s.text}
                  </span>
                  <pre>{s.score}</pre>
                </div>
              ))}
            </section>
          )}
        </section>
        {/* <section className="sidebar-section mt-2">
          <pre className="font-bold text-lg">Geocoder response</pre>
          <pre className="p-2 text-xs max-h-96 overflow-scroll ">
            {JSON.stringify(data, null, "  ")}
          </pre>
        </section> */}
      </SiteSidebar>
      <main>
        {geocodeValue && data && data.features.length > 0 && (
          <Candidate candidate={data.features[0]} session={session} />
        )}
        {geocodeValue && data && data.features.length == 0 && (
          <IssueReporterAddress
            session={session}
            address={geocodeValue}
            unset={() => setGeocodeValue(null)}
          />
        )}
        {geocodeValue && !data && resultType === "no-match" && (
          <>
          <div className="sidebar-section">
            <h2>We couldn't find the address {geocodeValue}!</h2>
            <p>If you think this should be a valid City address, please let us know using the form below.
            </p>
          </div>
          <IssueReporterAddress
            session={session}
            address={geocodeValue}
            unset={() => setGeocodeValue(null)}
            />
          </>
        )}
      </main>
    </>
  );
};

export default Validator;
