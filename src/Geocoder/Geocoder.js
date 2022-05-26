import { bulkGeocode } from "@esri/arcgis-rest-geocoding";
import { faUncharted } from "@fortawesome/free-brands-svg-icons";
import {
  faBan,
  faBox,
  faCheck,
  faCheckCircle,
  faInfoCircle,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Promise } from "bluebird";
import React, { useEffect, useMemo, useState } from "react";
import CSVReader from "react-csv-reader";
import AppHeader from "../components/AppHeader";
import Button from "../components/Button";
import IssueReporterAddress from "../components/IssueReporterAddress";
import { ToggleButton } from "../components/ToggleButton";
import apps from "../data/apps";
import { geocoders } from "../hooks/useGeocoder";
import SiteHeader from "../layout/SiteHeader";
import SiteSidebar from "../layout/SiteSidebar";
import GeocoderResults from "./GeocoderResults";

let customFields = [
  {
    name: "council",
    display: "Council District",
    geocoderColumn: "council_district",
    description: "The city council district number this address belongs to.",
    default: false,
  },
  {
    name: "neighborhood",
    display: "Neighborhood",
    geocoderColumn: "neighborhood_name",
    description: "The neighborhood name this address belongs to.",
    default: false,
  },
  {
    name: "master_plan_nhood",
    display: "Master Plan Neighborhood",
    geocoderColumn: "master_plan_nhood_name",
    description: "The master plan neighborhood this address belongs to.",
    default: false,
  },
  {
    name: "congressional_district",
    display: "Congressional District",
    geocoderColumn: "congressional_district",
    description: "The congressional district this address belongs to.",
    default: false,
  },
  {
    name: "county_commission_district",
    display: "County Commission District",
    geocoderColumn: "county_comission_district",
    description: "The county commission district this address belongs to.",
    default: false,
  },
  {
    name: "qct",
    display: "ARPA Qualified Census Tract",
    geocoderColumn: "is_qualified_census_tract",
    description: "These census tracts are qualified for...",
    default: false,
  },
  {
    name: "scout_car_area",
    display: "Police Scout Car Area",
    geocoderColumn: "scout_car_area",
    description: "The scout car area this address belongs to.",
    default: false,
  },
];

const CsvInput = ({ csv, setCsv, addresses, setAddresses }) => {
  return (
    <div className="border-gray-300 border-2 flex flex-col gap-3 px-4 py-2">
      <div className="flex items-center justify-between">
        <span className="font-semibold">Upload file </span>
        <CSVReader
          parserOptions={{ header: true }}
          onFileLoaded={(data, fileInfo) => setCsv(data)}
        />
      </div>
      {csv && (
        <div className="flex items-center justify-between">
          <p className="font-semibold">Choose address column</p>
          <select
            className="p-1 w-1/2"
            onChange={(e) => {
              setAddresses(csv.map((r) => r[e.target.value]));
            }}
          >
            <option value={`-`}>{`-`}</option>
            {Object.keys(csv[0]).map((d, i) => (
              <option value={d} key={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      )}
      {addresses.length > 0 && (
        <div className="w-full flex items-center justify-between">
          <span className="font-semibold">Example addresses</span>
          <span>{addresses.slice(0, 3).join("; ")}</span>
        </div>
      )}
    </div>
  );
};

const TextInput = ({ setAddresses }) => {
  // we store the user input in value
  let [value, setValue] = useState("");

  const addresses = useMemo(() => value.split("\n").filter((a) => a !== ""));

  useEffect(() => {
    setAddresses(addresses);
  }, [value]);

  return (
    <div className="p-3 bg-gray-300">
      <p className="font-semibold">Type one address per line</p>
      <textarea
        className="mt-2 border w-full p-2 text-sm"
        value={value}
        rows={8}
        type="text"
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

const Geocoder = ({ session, setSession, login, setLogin }) => {
  // csv upload
  let [csv, setCsv] = useState(null);
  // and split on a newline to get a list of addresses to geocode
  let [addresses, setAddresses] = useState([]);

  // create a default options object
  let defaultOptions = {
    mode: "upload",
    matched: true,
    coords: true,
    ids: true,
  };

  // add the customFields to the options object
  customFields.forEach((field) => {
    defaultOptions[field.name] = field.default;
  });

  let [options, setOptions] = useState(defaultOptions);

  // container for data
  let [payload, setPayload] = useState([]);

  // container for results
  let [results, setResults] = useState([]);

  let [unmatchedAddr, setUnmatchedAddr] = useState(null);

  useEffect(() => {
    setAddresses([]);
    setCsv(null);
    setResults([]);
    setPayload([]);
    setUnmatchedAddr(null);
  }, [options.mode]);

  useEffect(() => {
    setResults([]);
    setPayload([]);
    setUnmatchedAddr(null);
  }, [csv]);

  useEffect(() => {
    const fetchResults = () => {
      let allResults = [];

      let dataToSend = addresses.map((a, i) => {
        return { OBJECTID: i + 1, SingleLine: a };
      });

      const chunkSize = 1000;

      let allParams = [];

      for (let i = 0; i < dataToSend.length; i += chunkSize) {
        const chunk = dataToSend.slice(i, i + chunkSize);

        allParams.push({
          addresses: chunk,
          endpoint: geocoders.prod,
          params: {
            outSR: 4326,
            outFields: "*",
            // 'category': 'Point Address,Subaddress'
          },
        });
      }

      Promise.map(
        allParams,
        (params) => {
          return bulkGeocode(params);
        },
        { concurrency: 3 }
      )
        .each((f) => {
          allResults = allResults.concat(f.locations);
        })
        .then(() =>
          setResults(
            allResults.sort(
              (a, b) => a.attributes.ResultID - b.attributes.ResultID
            )
          )
        );
    };

    if (payload.length > 0) {
      fetchResults();
    }
  }, [payload]);

  return (
    <>
      <SiteHeader
        {...{ session, setSession, login, setLogin, currentApp: "geocoder" }}
      />
      <AppHeader app={apps.geocoder} />
      <SiteSidebar title="Geocoder">
        <section className="sidebar-section">
          <h2>Input your addresses</h2>
          <div className="flex items-center mt-2 justify-center">
            <ToggleButton
              title={`Upload .csv`}
              active={options.mode === "upload"}
              onClick={() => setOptions({ ...options, mode: "upload" })}
            />
            <ToggleButton
              title={`Text box input`}
              active={options.mode === "manual"}
              onClick={() => setOptions({ ...options, mode: "manual" })}
            />
          </div>
          <div className="py-3">
            {options.mode === "upload" && (
              <CsvInput {...{ setCsv, csv, addresses, setAddresses }} />
            )}
            {options.mode === "manual" && <TextInput {...{ setAddresses }} />}
          </div>

          {addresses.length > 0 && (
            <>
              <div className="flex items-start justify-between">
                <h3>Attach fields</h3>

                <div className="flex items-center gap-1">
                  {[true, false].map((b) => (
                    <Button
                      small
                      icon={b ? faCheck : faWindowClose}
                      key={`${b}-basic`}
                      text={b ? "All" : "None"}
                      onClick={() => {
                        let newOpts = {};
                        ["ids", "coords"].forEach((field) => {
                          newOpts[field] = b;
                        });
                        setOptions({ ...options, ...newOpts });
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="coords"
                  name="coords"
                  onChange={() =>
                    setOptions({ ...options, coords: !options.coords })
                  }
                  checked={options.coords}
                />
                <label htmlFor="coords">Coordinates (Lat/Lng)</label>
              </div>

              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="ids"
                  name="ids"
                  onChange={() => setOptions({ ...options, ids: !options.ids })}
                  checked={options.ids}
                />
                <label htmlFor="ids">Base unit IDs</label>
              </div>

              <div className="flex items-start justify-between mt-4">
                <h3>Attach boundaries</h3>

                <div className="flex items-center gap-1">
                  {[true, false].map((b) => (
                    <Button
                      key={`${b}-custom`}
                      small
                      icon={b ? faCheck : faWindowClose}
                      text={b ? "All" : "None"}
                      onClick={() => {
                        let newOpts = {};
                        customFields.forEach((field) => {
                          newOpts[field.name] = b;
                        });
                        setOptions({ ...options, ...newOpts });
                      }}
                    />
                  ))}
                </div>
              </div>

              {customFields.map((field) => (
                <div
                  className="checkbox-option flex items-center gap-1"
                  key={field.name}
                >
                  <input
                    type="checkbox"
                    id={field.name}
                    name={field.name}
                    onChange={() =>
                      setOptions({
                        ...options,
                        [field.name]: !options[field.name],
                      })
                    }
                    checked={options[field.name]}
                  />
                  <label htmlFor={field.name}>{field.display}</label>
                  <Tooltip.Provider>
                    <Tooltip.Root>
                      <Tooltip.Trigger>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="text-gray-400"
                        />
                      </Tooltip.Trigger>
                      <Tooltip.Content>
                        <p className="bg-white p-2 rounded-md text-sm text-gray-700">
                          {field.description}
                        </p>
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                </div>
              ))}
            </>
          )}
          {addresses.length > 0 && results.length === 0 && (
            <section className="flex justify-around mt-4">
              <Button
                small
                active={addresses.length > 0}
                disabled={addresses.length === 0}
                onClick={() => {
                  addresses.length > 0 && setPayload(addresses);
                }}
                text={
                  addresses.length > 0
                    ? payload.length > 0 && results.length === 0
                      ? `Geocoding...`
                      : `Geocode ${addresses.length} addresses`
                    : "Input addresses to geocode"
                }
                icon={addresses.length > 0 ? faCheckCircle : faBan}
              />
            </section>
          )}
        </section>
      </SiteSidebar>
      <main>
        {results.length > 0 && (
          <GeocoderResults
            results={results}
            addresses={payload}
            options={options}
            customFields={customFields}
            setUnmatchedAddr={setUnmatchedAddr}
            csv={csv}
          />
        )}
        {unmatchedAddr && (
          <IssueReporterAddress session={session} address={unmatchedAddr} unset={() => setUnmatchedAddr(null)} />
        )}
      </main>
    </>
  );
};

export default Geocoder;
