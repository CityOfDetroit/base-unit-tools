import {
  faBan,
  faCheckSquare,
  faDownload,
  faLeaf,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";
import SiteSidebar from "../layout/SiteSidebar";
import Button from "../components/Button";
import AppHeader from "../components/AppHeader";
import apps from "../data/apps";
import { bulkGeocode } from "@esri/arcgis-rest-geocoding";
import { geocoders } from "../hooks/useGeocoder";
import SiteHeader from "../layout/SiteHeader";
import CSVReader from "react-csv-reader";
import { ToggleButton } from "../components/ToggleButton";

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
];

const CsvInput = ({ setValue, addresses, setAddresses }) => {
  // csv upload
  let [csv, setCsv] = useState(null);

  return (
    <>
      <CSVReader
        parserOptions={{ header: true }}
        onFileLoaded={(data, fileInfo) => setCsv(data)}
      />
      {csv && (
        <div className="flex items-center justify-between mt-2">
          <p className="font-bold">Choose the "address" column in your data</p>
          <select
            className="p-2"
            onChange={(e) => {
              setAddresses(csv.map((r) => r[e.target.value]));
            }}
          >
            {Object.keys(csv[0]).map((d, i) => (
              <option value={d}>{d}</option>
            ))}
          </select>
        </div>
      )}
    </>
  );
};

const TextInput = ({ value, setValue }) => {
  return (
    <>
      <p className="text-sm">Please put one address on each line</p>
      <textarea
        className="mt-2 border w-full p-2 text-sm"
        value={value}
        rows={8}
        type="text"
        onChange={(e) => setValue(e.target.value)}
      />
    </>
  );
};

const Geocoder = ({ session, setSession, login, setLogin }) => {
  // we store the user input in value
  let [value, setValue] = useState("");
  // and split on a newline to get a list of addresses to geocode
  let [addresses, setAddresses] = useState([]);

  // create a default options object
  let defaultOptions = {
    mode: "upload",
    matched: true,
    coords: true,
    ids: true,
  }

  // add the customFields to the options object
  customFields.forEach(field => {
    defaultOptions[field.name] = field.default
  })

  let [options, setOptions] = useState(defaultOptions);

  // container for data
  let [payload, setPayload] = useState([]);

  // container for results
  let [results, setResults] = useState([]);

  useEffect(() => {
    setAddresses(value.split("\n").filter((a) => a !== ""));
  }, [value]);

  useEffect(() => {
    console.log(addresses)
  }, [addresses]);

  useEffect(() => {
    setValue("")
    setAddresses([])
  }, [options.mode]);

  useEffect(() => {
    if (payload.length > 0) {
      let dataToSend = addresses.map((a, i) => {
        return { OBJECTID: i + 1, SingleLine: a };
      });

      bulkGeocode({
        addresses: dataToSend,
        endpoint: geocoders.bounds,
        params: {
          outSR: 4326,
          outFields: "*",
          // 'category': 'Point Address,Subaddress'
        },
      }).then((d) => {
        setResults(
          d.locations.sort(
            (a, b) => a.attributes.ResultID - b.attributes.ResultID
          )
        );
      });
    }
  }, [payload]);

  let formattedData = results.map((r, i) => {
    return {
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
  });

  return (
    <>
      <SiteHeader
        {...{ session, setSession, login, setLogin, currentApp: "geocoder" }}
      />
      <AppHeader app={apps.geocoder} />
      <SiteSidebar title="Geocoder">
        <section className="sidebar-section">
          <h2>Input your data</h2>
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
              <CsvInput {...{ setValue, addresses, setAddresses }} />
            )}
            {options.mode === "manual" && (
              <TextInput {...{ value, setValue }} />
            )}
          </div>
        </section>

        <section className="sidebar-section">
          <h2>2. Choose your fields to output</h2>
          <div className="checkbox-option">
            <input
              type="checkbox"
              id="matched"
              name="matched"
              onChange={() =>
                setOptions({ ...options, matched: !options.matched })
              }
              checked={options.matched}
            />
            <label htmlFor="matched">Matched address</label>
          </div>
          <div className="checkbox-option">
            <input
              type="checkbox"
              id="council"
              name="council"
              onChange={() => setOptions({ ...options, council: !options.council })}
              checked={options.council}
            />
            <label htmlFor="council">Council district</label>
          </div>
          <div className="checkbox-option">
            <input
              type="checkbox"
              id="qct"
              name="qct"
              onChange={() => setOptions({ ...options, qct: !options.qct })}
              checked={options.qct}
            />
            <label htmlFor="qct">Qualified Census Tract</label>
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
        {results.length > 0 && (
          <div className="p-2">
            <p className="text-xl font-bold pb-3">Your geocoding results</p>
            <table className="w-full">
              <thead style={{ position: "sticky" }}>
                <tr style={{ position: "sticky" }}>
                  <th>Input</th>
                  {options.matched && <th>Match</th>}
                  {options.council && <th>Council Dist.</th>}
                  {options.qct && <th>Qualified Tract</th>}
                  {options.coords && <th>Longitude</th>}
                  {options.coords && <th>Latitude</th>}
                  {options.ids && <th>Address ID</th>}
                  {options.ids && <th>Building ID</th>}
                  {options.ids && <th>Parcel ID</th>}
                  {options.ids && <th>Street ID</th>}
                </tr>
              </thead>
              <tbody className="w-full">
                {results.map((r, i) => (
                  <tr
                    key={`${r.address} - ${i}`}
                    className={i % 2 === 1 ? "text-sm" : "text-sm bg-gray-100"}
                  >
                    <td>{addresses[i]}</td>
                    {options.matched && <td>{r.attributes.StAddr}</td>}
                    {options.council && <td>{r.attributes.council_district}</td>}
                    {options.qct && <td>{r.attributes.is_qualified_census_tract}</td>}
                    {options.coords && <td>{r.attributes.Y.toFixed(5)}</td>}
                    {options.coords && <td>{r.attributes.X.toFixed(5)}</td>}
                    {options.ids && (
                      <td>
                        <Link
                          to={`/explorer?type=addresses&id=${r.attributes.address_id}`}
                        >
                          {r.attributes.address_id}
                        </Link>
                      </td>
                    )}
                    {options.ids && (
                      <td>
                        <Link
                          to={`/explorer?type=buildings&id=${r.attributes.building_id}`}
                        >
                          {r.attributes.building_id}
                        </Link>
                      </td>
                    )}
                    {options.ids && (
                      <td>
                        <Link
                          to={`/explorer?type=parcels&id=${r.attributes.parcel_id}`}
                        >
                          {r.attributes.parcel_id}
                        </Link>
                      </td>
                    )}
                    {options.ids && (
                      <td>
                        <Link
                          to={`/explorer?type=streets&id=${r.attributes.street_id}`}
                        >
                          {r.attributes.street_id}
                        </Link>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
};

export default Geocoder;
