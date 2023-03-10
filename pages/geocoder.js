import { bulkGeocode } from "@esri/arcgis-rest-geocoding";
import { faBan, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Promise } from "bluebird";
import React, { useEffect, useState } from "react";
import AppHeader from "../src/components/AppHeader";
import Button from "../src/components/Button";
import IssueReporterAddress from "../src/components/IssueReporterAddress";
import apps from "../src/data/apps";
import { geocoderFields } from "../src/data/geocoderFields";
import { geocoders } from "../src/hooks/useGeocoder";
import SiteSidebar from "../src/layout/SiteSidebar";
import { CsvInput } from "../src/Geocoder/CsvInput";
import { InputChoice } from "../src/Geocoder/InputChoice";
import GeocoderOptions from "../src/Geocoder/GeocoderOptions";
import GeocoderResults from "../src/Geocoder/GeocoderResults";
import { TextInput } from "../src/Geocoder/TextInput";

/**
 * This function chunks addresses in batches of 1000 and geocodes them.
 * @param {} addresses
 * @param {} setResults
 */
const fetchResults = (addresses, setResults) => {
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
      endpoint: geocoders.dev,
      params: {
        outSR: 4326,
        outFields: "*",
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
      setResults(allResults.sort((a, b) => a.attributes.ResultID - b.attributes.ResultID))
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

  // add the geocoderFields to the options object
  geocoderFields.forEach((field) => {
    defaultOptions[field.name] = field.default;
  });

  let [options, setOptions] = useState(defaultOptions);

  // container for data
  let [payload, setPayload] = useState([]);

  // container for results
  let [results, setResults] = useState([]);

  let [unmatchedAddr, setUnmatchedAddr] = useState(null);

  useEffect(() => {
    setCsv(null);
    setAddresses([]);
    setPayload([]);
    setResults([]);
    setUnmatchedAddr(null);
  }, [options.mode]);

  useEffect(() => {
    setResults([]);
    setPayload([]);
    setUnmatchedAddr(null);
  }, [csv]);

  useEffect(() => {
    if (payload.length > 0) {
      fetchResults(addresses, setResults);
    }
  }, [payload, addresses]);

  return (
    <>
      <AppHeader app={apps.geocoder} />
      <SiteSidebar title="Geocoder">
        <section className="sidebar-section">
          <div className="flex items-center justify-between">
            <h2>Address input</h2>
            <InputChoice setOptions={setOptions} options={options} />
          </div>

          <div className="py-3">
            {options.mode === "upload" && (
              <CsvInput {...{ setCsv, csv, addresses, setAddresses }} />
            )}
            {options.mode === "manual" && <TextInput {...{ setAddresses }} />}
          </div>
        </section>

        <GeocoderOptions {...{ options, setOptions }} />

        {addresses.length > 0 && results.length === 0 && (
          <section className="flex justify-around sidebar-section">
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
      </SiteSidebar>
      <main>
        {results.length > 0 && (
          <GeocoderResults
            results={results}
            addresses={payload}
            options={options}
            geocoderFields={geocoderFields}
            setUnmatchedAddr={setUnmatchedAddr}
            csv={csv}
          />
        )}
        {unmatchedAddr && (
          <IssueReporterAddress
            session={session}
            address={unmatchedAddr}
            unset={() => setUnmatchedAddr(null)}
          />
        )}
      </main>
    </>
  );
};

export default Geocoder;
