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

// object to track filters
const filters = {
  'USPS-deliverable': null
}

const Mailer = ({ session }) => {

  // this tool is principally driven by this geom
  const [geom, setGeom] = useState(null)

  // use this to see if the user has access to the mailing list layer
  const [access, setAccess] = useState(false)

  // store the selection area object IDs and the actual results, respectively.
  const [resultIds, setResultIds] = useState(null)
  const [addresses, setAddresses] = useState([])
  
  // mailing list layer.
  // theoretically we can put any layer here to make a generalized selection tool.
  let url = `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/AddrPoints_USPS_Jan2021/FeatureServer/0`

  // this effect runs if the user logs in or out.
  // it tests access to the mailing list layer
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

  // this effect runs when the geom changes (or if there's a change in access)
  // it gets the objectids for all the features in the selection -- 
  // we just want this list so we can display a total count && generate breakpoints
  // in the fetchAddresses function
  useEffect(() => {
    setResultIds(null)
    if (geom && access) {
      queryFeatures({
        url: url,
        // the key bit
        returnIdsOnly: true,
        orderByFields: "OBJECTID",
        // intersects-with-selectino parameters
        geometry: geojsonToArcGIS(geom)[0].geometry,
        geometryType: "esriGeometryPolygon",
        spatialRel: "esriSpatialRelIntersects",
        httpMethod: "POST",
        authentication: session
      }).then(d => {
        setResultIds(d)
      })
    }
  }, [geom, access])


  // this function is what runs when we click "Download CSV"
  // we'll use the list of objectIDs to actually go get the addresses
  const fetchAddresses = () => {

    // fetch this many addresses at a time. we can turn this up to 2000
    const chunkSize = 500

    // get the "breakpoints": basically the first ID value, then every chunkSize'th value afterwards
    let breakpoints = resultIds.objectIds.filter((oid, i) => (i === 0 || ((i) % chunkSize === 0)))

    // push the last ObjectID plus one onto the stack -- we still need to fetch between it
    breakpoints.push(resultIds.objectIds.slice(-1,)[0] + 1)

    // create a bunch of Promises for the number of queries we need
    let promises = breakpoints.slice(1).map((b, i) => {
      let params = {
        url: url,
        orderByFields: "OBJECTID",
        // this is confusing, but produces the correct result.
        // it has to be weird because of how BETWEEN works in the Esri API
        where: `OBJECTID between ${i === 0 ? (breakpoints[0] - 1) : (breakpoints[i])} and ${b - 1}`,
        geometry: geojsonToArcGIS(geom)[0].geometry,
        geometryType: "esriGeometryPolygon",
        spatialRel: "esriSpatialRelIntersects",
        httpMethod: "POST",
        resultRecordCount: chunkSize,
        authentication: session
      }
      return queryFeatures(params)
    })

    // execute all those Promises
    Promise.all(promises)
      .then(resps => {
        // stack up each query response's features into this empty array
        let allAddresses = []
        resps.forEach(r => {
          allAddresses = allAddresses.concat(r.features)
        })
        // store them in state
        setAddresses(allAddresses)
      })
  }

  return (
    <>
      
      <SiteSidebar title="Mailer">

        {/* Show a warning if the user doesn't have access to the layer. */}
        {!access && <section className="sidebar-section warning">
          You don't currently have access to this tool, so it may not work correctly.
        </section>}

        {/* Boundary picker */}
        <MailerLayerSelector {...{geom, setGeom}} />

        {/* If we have a shape, display the Buffer tool */}
        {geom && <MailerBuffer {...{geom, setGeom}}/>}

        {/* If we have a shape, display information about the selection */}
        {geom && 
          <section className='sidebar-section'>
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
          </section>
        }

        {/* If there's a shape and access to the layer */}
        {geom && access && 
          <section className="sidebar-section">

            {/* If we're waiting on result IDs, show a Loading message */}
            {!resultIds && geom && <h1>Loading...</h1>}
            
            {/* If we have result IDs, show the export portion. */}
            {resultIds && 
              <>
              <h2>Export mailing addresses to CSV</h2>
              {/* <h3 className="text-sm mt-3">Include these attributes for each address:</h3>
              {
                Object.keys(options).map(o => (
                  <div className="p-1">
                  <input type="checkbox" name={o} checked={false}></input>
                  <label for={o} className="ml-2">{o}</label>
                  </div>
                ))
              } */}
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