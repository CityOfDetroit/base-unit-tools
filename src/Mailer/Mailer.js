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

const Mailer = ({ session }) => {

  const [geom, setGeom] = useState(null)
  const [access, setAccess] = useState(false)
  const [resultIds, setResultIds] = useState(null)
  
  let url = `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/AddrPoints_USPS_Jan2021/FeatureServer/0`

  useEffect(() => {
    getLayer({
      url: url,
      authentication: session
    }).then(d => {
      setAccess(d)
    })
  }, [])

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
  }, [geom, session])


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
        <section className="sidebar-section">
          <h2>Mailer</h2>
          <div className="flex items-center justify-between">
          </div>
        </section>
        {!access && <section className="sidebar-section warning">
          You don't currently have access to this tool, so it may not work correctly.
        </section>}
        <MailerLayerSelector {...{geom, setGeom}} />
        {geom && <MailerBuffer {...{geom, setGeom}}/>}
        {geom && <section className='sidebar-section'>
          <h2>Current selection: {(area(geom) * 0.000000386102).toFixed(3)} sq. mi.</h2>
          <Button icon={faTrash} onClick={() => setGeom(null)} text="Delete current selection" />
        </section>}
        {geom && access && 
          <section className="sidebar-section">
            {!resultIds && geom && <h1>Loading...</h1>}
            {resultIds && 
              <>
              <h2>{resultIds.objectIds.length} addresses in the selection area</h2>
              <Button icon={faDownload} onClick={() => fetchAddresses()} text="Get addresses" />
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