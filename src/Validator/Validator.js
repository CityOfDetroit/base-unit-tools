import React, { useEffect, useState } from "react";
import AppHeader from "../components/AppHeader";
import apps from "../data/apps";
import SiteSidebar from "../layout/SiteSidebar";
import parse from "../parser.js";
import SiteHeader from "../layout/SiteHeader";
import { suggest } from "@esri/arcgis-rest-geocoding";
import { geocoders, useGeocoder } from "../hooks/useGeocoder";
import Button from "../components/Button";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import Candidate from "./Candidate";

const Validator = ({ session, setSession, login, setLogin }) => {
  let [value, setValue] = useState("");

  let [geocodeValue, setGeocodeValue] = useState(null);

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
      <p>
        Use this tool to see how our address parser breaks down a full address
        into its component parts, like street number and street name.
      </p>
      <p>
        Enter one address in the box below and you'll see the output of the
        parser.
      </p>
      <p>
        The Rules Applied section will show you how the tool is working. For
        example, if you enter <i>123 St Aubin</i> you'll see that the <i>St</i>{" "}
        has been expanded to <i>Saint.</i>
      </p>
    </>
  );

  useEffect(() => {
    suggest(value, {
      endpoint: geocoders.point,
    }).then((r) => {
      setSuggestions(r.suggestions);
    });
  }, [value]);

  return (
    <>
      <SiteHeader
        {...{ session, setSession, login, setLogin, currentApp: "validator" }}
      />
      <AppHeader app={apps.validator} introduction={introduction} />
      <SiteSidebar title="Validator">
        {/* <section className="sidebar-section">
          <h4>Output</h4>
          {displayFields.map((f) => (
            <div
              key={f[1]}
              className="bg-grey-200 flex items-center justify-start my-2"
            >
              <h4 className="w-1/3 text-sm font-normal">{f[1]}</h4>
              <pre className="text-sm">{results[f[0]]}</pre>
            </div>
          ))}
        </section>
        <section className="p-2 mb-2 text-sm bg-gray-300">
          <h4 className="text-sm">Rules applied:</h4>
          {applied.map((a) => (
            <div
              key={a.rule}
              className="bg-grey-200 flex items-center justify-start my-2 text-sm"
            >
              <span className="w-2/3 text-sm text-gray-700">{a.rule}</span>
              <pre>{a.results[0].trim()}</pre>
            </div>
          ))}
        </section>
        <pre className="sidebar-section">
          {JSON.stringify(parse(value).results, null, "\t")}
        </pre> */}
      </SiteSidebar>
      <main>
        <section className="sidebar-section mb-2">
          <h2>Address to validate</h2>
          <div className="flex items-center justify-between">
            <input
              className="p-3 w-full mt-2"
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setGeocodeValue(null)
              }}
            />
            <Button
              icon={faCheckSquare}
              onClick={() => setGeocodeValue(value)}
              text="Validate"
              small
              className="p-1"
            />
          </div>
        </section>
        {suggestions.length > 0 && !geocodeValue && (
          <section className="bg-gray-200 px-2 py-1">
            {suggestions.map((s) => (
              <div
                key={s.text}
                className="bg-grey-200 flex items-center justify-start my-2 text-sm"
                onClick={() => {
                  setValue(s.text.split(",")[0]);
                  setSuggestions([]);
                  setGeocodeValue(s.text.split(",")[0]);
                }}
              >
                <span className="w-2/3 text-sm text-gray-700">{s.text}</span>
                <pre>{s.score}</pre>
              </div>
            ))}
          </section>
        )}
        {geocodeValue && data && 
          <>
          {/* <pre className="p-2 text-xs max-h-96 overflow-scroll ">{JSON.stringify(data, null, "\t")}</pre> */}
          {data.features.map(candidate => <Candidate candidate={candidate} />)}
          </>
        }
      </main>
    </>
  );
};

export default Validator;
