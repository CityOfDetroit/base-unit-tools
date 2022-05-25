import { bulkGeocode } from "@esri/arcgis-rest-geocoding";
import {
  faBan,
  faCheckSquare,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { Promise } from "bluebird";
import React, { useEffect, useMemo, useState } from "react";
import { CSVLink } from "react-csv";
import CSVReader from "react-csv-reader";
import AppHeader from "../components/AppHeader";
import Button from "../components/Button";
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
    name: "qct",
    display: "Qualified Census Tract",
    geocoderColumn: "is_qualified_census_tract",
    description: "These census tracts are qualified for...",
    default: false,
  },
  {
    name: "neighborhood",
    display: "Neighborhood",
    geocoderColumn: "neighborhood_name",
    description: "The neighborhood name this address belongs to.",
    default: false
  },
  {
    name: "scout_car_area",
    display: "Scout Car Area",
    geocoderColumn: "scout_car_area",
    description: "The scout car area this address belongs to.",
    default: false
  },
  {
    name: "master_plan_nhood",
    display: "Master Plan Neighborhood",
    geocoderColumn: "master_plan_nhood_name",
    description: "The master plan neighborhood this address belongs to.",
    default: false
  },
  {
    name: "congressional_district",
    display: "Congressional District",
    geocoderColumn: "congressional_district",
    description: "The congressional district this address belongs to.",
    default: false
  },
  {
    name: "county_commission_district",
    display: "County Commission District",
    geocoderColumn: "county_comission_district",
    description: "The county commission district this address belongs to.",
    default: false
  }
];

const CsvInput = ({ csv, setCsv, addresses, setAddresses }) => {

  return (
    <div className="p-2 bg-gray-300">
      <div className="p-2 flex items-center justify-between">
        <span className="font-semibold">Upload file </span>
        <CSVReader
          parserOptions={{ header: true }}
          onFileLoaded={(data, fileInfo) => setCsv(data)}
        />
      </div>
      {csv && (
        <div className="flex items-center justify-between p-2">
          <p className="font-semibold">Choose address column</p>
          <select
            className="p-1 w-1/2"
            onChange={(e) => {
              setAddresses(csv.map((r) => r[e.target.value]));
            }}
          >
            <option value={`-`}>{`-`}</option>
            {Object.keys(csv[0]).map((d, i) => (
              <option value={d}>{d}</option>
            ))}
          </select>
        </div>
      )}
      {addresses.length > 0 && (
        <div className="w-full block flex items-center justify-between p-2">
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
    <div className="p-2 bg-gray-300">
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

  let [total, setTotal] = useState(0)

  let [unmatchedAddr, setUnmatchedAddr] = useState(null);

  useEffect(() => {
    setAddresses([]);
    setCsv(null);
    setResults([]);
    setPayload([]);
  }, [options.mode]);

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

  let formattedData = results.map((r, i) => {
    let row = {
      input: addresses[i],
      address: r.attributes.StAddr,
      zip_code: r.attributes.Postal,
      address_id: r.attributes.address_id,
      building_id: r.attributes.building_id,
      // we format
      parcel_id: `=""${r.attributes.parcel_id}""`,
      street_id: r.attributes.street_id,
      lng: r.attributes.X.toFixed(5),
      lat: r.attributes.Y.toFixed(5),
      council_district: r.attributes.council_district,
      is_qualified_census_tract: r.attributes.is_qualified_census_tract,
    };

    if (csv) {
      row = {
        ...csv[i],
        ...row,
      };
    }
    return row;
  });

  return (
    <>
      <SiteHeader
        {...{ session, setSession, login, setLogin, currentApp: "geocoder" }}
      />
      <AppHeader app={apps.geocoder} />
      <SiteSidebar title="Geocoder">
        <section className="sidebar-section">
          <h2>Input your addresses</h2>
          <div className="flex items-center mt-2">
            <ToggleButton
              title={`Upload a .csv`}
              active={options.mode === "upload"}
              onClick={() => setOptions({ ...options, mode: "upload" })}
            />
            <ToggleButton
              title={`Form input`}
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
        </section>

        <section className="sidebar-section">
          <h2>Choose data to attach</h2>

          {customFields.map(field => (
            <div className="checkbox-option" key={field.name}>
              <input
                type="checkbox"
                id={field.name}
                name={field.name}
                onChange={() =>
                  setOptions({ ...options, [field.name]: !options[field.name] })
                }
                checked={options[field.name]}
              />
              <label htmlFor={field.name}>{field.display}</label>
            </div>
          ))}

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
            <label htmlFor="coords">Coordinates</label>
          </div>

          <div className="checkbox-option">
            <input
              type="checkbox"
              id="ids"
              name="ids"
              onChange={() => setOptions({ ...options, ids: !options.ids })}
              checked={options.ids}
            />
            <label htmlFor="ids">Attach IDs</label>
          </div>
        </section>

        <section className="sidebar-section flex justify-between">
          <div>
            <h2>3. Geocode!</h2>
            <p className="text-sm">Match addresses to locations</p>
          </div>
          <Button
            active={addresses.length > 0}
            small
            disabled={addresses.length === 0}
            onClick={() => {
              addresses.length > 0 && setPayload(addresses);
            }}
            text={addresses.length > 0 ? "Go!" : "No addresses"}
            icon={addresses.length > 0 ? faCheckSquare : faBan}
          />
        </section>

        {formattedData.length > 0 && (
          <section className="sidebar-section flex justify-between">
            <div>
              <h2>4. Export</h2>
            </div>
            <CSVLink
              data={formattedData}
              filename={`geocode_results_${new Date().getTime()}.csv`}
            >
              <Button
                active={results.length > 0}
                disabled={results.length === 0}
                icon={faDownload}
                small
                text="Export to .csv"
              />
            </CSVLink>
          </section>
        )}
      </SiteSidebar>
      <main>
        {addresses.length > 0 && (
          <section className="sidebar-section">
            <h2>Geocoding Results</h2>
            <p>{addresses.length} addresses</p>
            <p>{results.filter(r => r.attributes.StAddr !== '').length} matches</p>
          </section>
        )}
        {results.length > 0 && (
          <GeocoderResults
            results={results}
            addresses={payload}
            options={options}
            customFields={customFields}
            setUnmatchedAddr={setUnmatchedAddr}
          />
        )}
      </main>
    </>
  );
};

export default Geocoder;
