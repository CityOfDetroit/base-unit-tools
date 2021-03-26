import React, { useState, useEffect } from 'react';

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import area from '@turf/area'

import { geojsonToArcGIS } from '@esri/arcgis-to-geojson-utils';
import { getLayer, queryFeatures } from '@esri/arcgis-rest-feature-layer'

import { faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';
import SiteSidebar from '../layout/SiteSidebar'
import Button from '../components/Button';
import MailerBuffer from './MailerBuffer';
import MailerLayerSelector from './MailerLayerSelector';
import MailerMap  from './MailerMap';

const filters = {
  'Owner-occupied': null,
  'Publicly-owned': null,
  'Multifamily': null 
}

const options = {
  'Neighborhood': null,
  'Council district': null,
  'Census tract': null
}

const Mailer = ({ session }) => {

  const [geom, setGeom] = useState(null)
  const [access, setAccess] = useState(false)
  const [resultIds, setResultIds] = useState(null)
  
  let url = `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/AddrPoints_USPS_Jan2021/FeatureServer/0`

  useEffect(() => {
    if(!session) {
      setAccess(false)
    }
    getLayer({
      url: url,
      authentication: session
    }).then(d => {
      setAccess(d)
    })
  }, [session])

  useEffect(() => {
    setResultIds(null)
    if (geom && access) {
      queryFeatures({
        url: url,
        returnIdsOnly: true,
        orderByFields: "OBJECTID",
        geometry: geojsonToArcGIS(geom)[0].geometry,
        geometryType: "esriGeometryPolygon",
        spatialRel: "esriSpatialRelIntersects",
        httpMethod: "POST",
        authentication: session
      }).then(d => {
        setResultIds(d)
      })
    }
  }, [geom, session, access])


  const fetchAddresses = () => {
    let addresses = []
    const chunkSize = 500
    let breakpoints = resultIds.objectIds.filter((oid, i) => i % chunkSize === 0)
    breakpoints.push(resultIds.objectIds.slice(-1,)[0])
    breakpoints.forEach((b, i) => {
      if(i > 0) {
        queryFeatures({
          url: url,
          orderByFields: "OBJECTID",
          where: `OBJECTID between ${i === 1 ? breakpoints[i-1] : (breakpoints[i-1] + 1)} and ${b}`,
          geometry: geojsonToArcGIS(geom)[0].geometry,
          geometryType: "esriGeometryPolygon",
          spatialRel: "esriSpatialRelIntersects",
          httpMethod: "POST",
          resultRecordCount: chunkSize,
          authentication: session
        }).then(d => {
          addresses = addresses.concat(d.features)
        }
        )
      }
    })
    console.log(addresses)
  }

  return (
    <>
      <SiteSidebar title="Mailer">
        {!access && <section className="sidebar-section warning">
          You don't currently have access to this tool, so it may not work correctly.
        </section>}
        <MailerLayerSelector {...{geom, setGeom}} />
        {geom && <MailerBuffer {...{geom, setGeom}}/>}
        {geom && <section className='sidebar-section'>
          <h2>Current selection:</h2> 
          <ul className="list-disc list-inside">
            <li>
              {(area(geom) * 0.000000386102).toFixed(3)} square miles
            </li>
            {resultIds && <li>
              {resultIds.objectIds.length} addresses in the selection area
            </li>}
          </ul>
          <h3 className="text-sm mt-3">Filter addresses by:</h3>
              {
                Object.keys(filters).map(f => (
                  <div className="p-1">
                  <input type="checkbox" name={f} checked={false}></input>
                  <label for={f} className="ml-2">{f}</label>
                  </div>
                ))
              }
          <div className="flex flex-row-reverse">
            <Button icon={faTrash} onClick={() => setGeom(null)} text="Delete current selection" />
          </div>
        </section>}
        {geom && access && 
          <section className="sidebar-section">
            {!resultIds && geom && <h1>Loading...</h1>}
            {resultIds && 
              <>
              <h2>Export mailing addresses to CSV</h2>
              <h3 className="text-sm mt-3">Include these attributes for each address:</h3>
              {
                Object.keys(options).map(o => (
                  <div className="p-1">
                  <input type="checkbox" name={o} checked={false}></input>
                  <label for={o} className="ml-2">{o}</label>
                  </div>
                ))
              }
              <div className="flex flex-row-reverse">
              <Button icon={faDownload} onClick={() => fetchAddresses()} text="Download .csv" />
              </div>
              </>
            }
          </section>
        }
      </SiteSidebar>
      <main>
        <MailerMap {...{ geom, setGeom }} />
      </main>
    </>
  )
}

export default Mailer;