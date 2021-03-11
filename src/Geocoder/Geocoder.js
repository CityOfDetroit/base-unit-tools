import React, { useState, useRef, useEffect } from 'react';
import {Link} from 'react-router-dom'

import SiteSidebar from '../layout/SiteSidebar';
import SiteWrapper from '../layout/SiteWrapper';
import { CSVLink } from 'react-csv';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWrench } from '@fortawesome/free-solid-svg-icons';


export const geocoders = [
  {
    name: 'Base Units Geocoder',
    url: `https://opengis.detroitmi.gov/opengis/rest/services/BaseUnits/BaseUnitGeocoder/GeocodeServer`
  },
  {
    name: 'Base Units Geocoder Units',
    url: `https://opengis.detroitmi.gov/opengis/rest/services/BaseUnits/BaseUnitGeocoderUnits/GeocodeServer`
  }
]

const Geocoder = () => {

  let [value, setValue] = useState('')
  let [geocoder, setGeocoder] = useState(geocoders[0])

  // options htmlFor geocoding
  let [matched, setMatched] = useState(true)
  let [coords, setCoords] = useState(true)
  let [council, setCouncil] = useState(true)
  let [ids, setIds] = useState(true)

  // container for data
  let [payload, setPayload] = useState([])

  // container for results
  let [results, setResults] = useState([])

  let addresses = value.split("\n").filter(a => a !== "")

  useEffect(() => {
    if (payload.length > 0) {


      let dataToSend = {
        records: addresses.map((a, i) => {
          return {
            "attributes": { "OBJECTID": i, "SingleLine": a }
          }
        })
      }

      let bodyFormData = new FormData();
      bodyFormData.set('addresses', JSON.stringify(dataToSend));
      bodyFormData.set('f', 'json');
      bodyFormData.set('outFields', '*');
      bodyFormData.set('outSR', 4326);

      fetch(`${geocoder.url}/geocodeAddresses`, {
        body: bodyFormData,
        method: 'POST'
      }).then(r => r.json()).then(d => {
        setResults(d.locations.sort((a,b) => a.attributes.ResultID - b.attributes.ResultID))
      })
    }
  }, [payload])

  let formattedData = results.map((r, i) => {
    return {
      input: addresses[i],
      address: r.attributes.StAddr,
      zip_code: r.attributes.Postal,
      address_id: r.attributes.address_id,
      building_id: r.attributes.building_id,
      parcel_id: `=""${r.attributes.parcel_id}""`,
      street_id: r.attributes.street_id,
      lng: r.attributes.X.toFixed(5),
      lat: r.attributes.Y.toFixed(5),
      council_district: r.attributes.council_district
    }
  })

  return (
    <>
      <SiteSidebar title="Geocoder">
        <p className="opacity-50 text-xs mb-2">currently using: <a href={geocoder.url}><strong>{geocoder.name}</strong></a></p>
        <section className="sidebar-section">
          <h2>1. Enter your list of addresses</h2>
          <p className="text-sm">Please put one address on each line</p>
          <textarea className="mt-2 border w-full p-2 text-sm" value={value} rows={8} type="text" onChange={(e) => setValue(e.target.value)} />
          <p className="text-sm">{addresses.length} addresses to geocode</p>
        </section>
        <section className="sidebar-section">
          <h2>2. Choose your fields to output</h2>
          <div className="checkbox-option">
            <input type="checkbox" id="matched" name="matched" onChange={() => setMatched(!matched)} checked={matched} />
            <label htmlFor="matched">Matched address</label>
          </div>
          <div className="checkbox-option">
            <input type="checkbox" id="council" name="council" onChange={() => setCouncil(!council)} checked={council} />
            <label htmlFor="council">Council district</label>
          </div>
          <div className="checkbox-option">
            <input type="checkbox" id="coords" name="coords" onChange={() => setCoords(!coords)} checked={coords} />
            <label htmlFor="coords">Coordinates</label>
          </div>
          <div className="checkbox-option">
            <input type="checkbox" id="ids" name="ids" onChange={() => setIds(!ids)} checked={ids} />
            <label htmlFor="ids">Attach IDs</label>
          </div>
        </section>
        <section className="sidebar-section flex justify-between">
          <div>
            <h2>3. Geocode!</h2>
            <p className="text-sm">Match addresses to locations</p>
          </div>
          <button
            className={addresses.length === 0 ? "btn-disabled" : "btn-enabled"}
            disabled={addresses.length === 0}
            onClick={() => { addresses.length > 0 && setPayload(addresses) }}>
            {addresses.length > 0 ? 'Go!' : 'No addresses'}
          </button>
        </section>
        <section className="sidebar-section flex justify-between">
          <div>

            <h2>4. Export</h2>
            <p className="text-sm">Export to .csv</p>
          </div>
          <button
            className={results.length === 0 ? "btn-disabled" : "btn-enabled"}
            disabled={results.length === 0}
          > 
            <CSVLink data={formattedData} filename={`geocode_results_${new Date().getTime()}.csv`}>
              <span>.csv</span>
            </CSVLink>
          </button>
        </section>
      </SiteSidebar>
      <main>
        {results.length > 0 &&
          <div className="p-2">
            <p className="text-xl font-bold pb-3">Your geocoding results</p>
            <table className="w-full">
              <thead style={{ position: 'sticky' }}>
                <tr style={{ position: 'sticky' }}>
                  <th></th>
                  <th>Input</th>
                  {matched && <th>Match</th>}
                  {council && <th>Council Dist.</th>}
                  {coords && <th>Longitude</th>}
                  {coords && <th>Latitude</th>}
                  {ids && <th>Address ID</th>}
                  {ids && <th>Building ID</th>}
                  {ids && <th>Parcel ID</th>}
                  {ids && <th>Street ID</th>}
                </tr>
              </thead>
              <tbody className="w-full">
                {results.map((r, i) => (
                  <tr key={`${r.address} - ${i}`} className={i % 2 === 1 ? "text-sm" : "text-sm bg-gray-100"}>
                    <td><Link to={`/issue-reporter?address=${addresses[i]}`}><FontAwesomeIcon icon={faWrench} /></Link></td>
                    <td>{addresses[i]}</td>
                    {matched && <td>{r.attributes.StAddr}</td>}
                    {council && <td>{r.attributes.council_district}</td>}
                    {coords && <td>{r.attributes.Y.toFixed(5)}</td>}
                    {coords && <td>{r.attributes.X.toFixed(5)}</td>}
                    {ids && <td><Link to={`/explorer?type=addresses&id=${r.attributes.address_id}`}>{r.attributes.address_id}</Link></td>}
                    {ids && <td><Link to={`/explorer?type=buildings&id=${r.attributes.building_id}`}>{r.attributes.building_id}</Link></td>}
                    {ids && <td><Link to={`/explorer?type=parcels&id=${r.attributes.parcel_id}`}>{r.attributes.parcel_id}</Link></td>}
                    {ids && <td><Link to={`/explorer?type=streets&id=${r.attributes.street_id}`}>{r.attributes.street_id}</Link></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </main>
    </>
  )
}

export default Geocoder;