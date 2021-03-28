import { faBan, faCheckSquare, faDownload, faWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';
import { geocoders } from '../data/geocoders';
import SiteSidebar from '../layout/SiteSidebar';
import Button from '../components/Button'
import AppIntro from '../components/AppIntro';
import apps from '../data/apps';

const Geocoder = () => {

  // we store the user input in value
  let [value, setValue] = useState('')
  // and split on a newline to get a list of addresses to geocode
  let addresses = value.split("\n").filter(a => a !== "")

  // TODO: let the user pick from a number of geocoders
  let [geocoder, setGeocoder] = useState(geocoders[3])

  // options for geocoding
  let [matched, setMatched] = useState(true)
  let [coords, setCoords] = useState(true)
  let [council, setCouncil] = useState(true)
  let [ids, setIds] = useState(true)

  // container for data
  let [payload, setPayload] = useState([])

  // container for results
  let [results, setResults] = useState([])


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
      // we format 
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
        {/* <p className="opacity-50 text-xs mb-2">currently using: <a href={geocoder.url}><strong>{geocoder.name}</strong></a></p> */}

        {/* <AppIntro app={apps.geocoder}>
        </AppIntro> */}
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
          <Button
            active={addresses.length > 0}
            small
            disabled={addresses.length === 0}
            onClick={() => { addresses.length > 0 && setPayload(addresses) }}
            text={addresses.length > 0 ? 'Go!' : 'No addresses'}
            icon={addresses.length > 0 ? faCheckSquare : faBan}
            />
        </section>
        {formattedData.length > 0 && <section className="sidebar-section flex justify-between">
          <div>
            <h2>4. Export</h2>
          </div>
          <CSVLink data={formattedData} filename={`geocode_results_${new Date().getTime()}.csv`}>
            <Button
              active={results.length > 0}
              disabled={results.length === 0}
              icon={faDownload}
              small
              text='Export to .csv'
            /> 
          </CSVLink>
        </section>}
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