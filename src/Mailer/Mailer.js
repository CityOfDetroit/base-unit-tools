import { getLayer, queryFeatures } from '@esri/arcgis-rest-feature-layer';
import { geojsonToArcGIS } from '@esri/arcgis-to-geojson-utils';
import { faDownload, faLock, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import SiteSidebar from '../layout/SiteSidebar';
import MailerBuffer from './MailerBuffer';
import MailerLayerSelector from './MailerLayerSelector';
import MailerMap from './MailerMap';
import MailerSelection from './MailerSelection'

// object to track filters
const filters = {
  'USPS-deliverable': null
}

const Mailer = ({ session }) => {

  // this tool is principally driven by this piece of state
  // which represents represents the current selection area
  const [geom, setGeom] = useState(null)

  // use this boolean to see if the user has access to the mailing list layer
  const [access, setAccess] = useState(false)

  // store the selection area object IDs, all addresses, and the filtered addresses.
  const [resultIds, setResultIds] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [filtered, setFiltered] = useState([])

  // mailing list layer.
  // theoretically we can put any layer here to make a generalized selection tool.
  let url = `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/AddrPoints_USPS_Jan2021/FeatureServer/0`

  // this effect runs if the user logs in or out.
  // it tests access to the mailing list layer
  useEffect(() => {
    if (!session) {
      setAccess(false)
    }
    getLayer({
      url: url,
      authentication: session
    }).then(d => {
      setAccess(d)
    }).catch(err => {
      setAccess(false)
    })
  }, [session, url])

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
  }, [geom, access, session, url])


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
        // it has to be weird because of how BETWEEN seems to work.
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
        {!access && <section className="sidebar-section caution flex items-center">
          <FontAwesomeIcon icon={faLock} className="text-xl ml-2 mr-4" />
          <div>
            <p>
              You don't currently have access to this tool, so it may not work correctly.
            </p>
            <p>
              Please log in, or if you are logged in, <a href="https://app.smartsheet.com/b/form/6919c51a844448e2a6811f04a6267292">contact the team</a> for access.
            </p>
          </div>
        </section>}

        {/* Boundary picker */}
        <MailerLayerSelector {...{ geom, setGeom }} />

        {/* If we have a shape, display buffer tool, current selection */}
        {geom && <MailerBuffer {...{ geom, setGeom }} />}
        {geom && resultIds && <MailerSelection {...{ geom, setGeom, resultIds }} />}

        {geom &&
        <section className='sidebar-section'>
          <h3 className="text-sm mt-3">Filter addresses by:</h3>
          {
            Object.keys(filters).map(f => (
              <div className="p-1" key={f}>
                <input type="checkbox" name={f} checked={false} readOnly></input>
                <label htmlFor={f} className="ml-2">{f}</label>
              </div>
            ))
          }
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