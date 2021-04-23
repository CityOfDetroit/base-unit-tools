import { getLayer, queryFeatures } from '@esri/arcgis-rest-feature-layer';
import { geojsonToArcGIS } from '@esri/arcgis-to-geojson-utils';
import { faDownload, faDrawPolygon, faSlash, faLock, faMailBulk, faMapMarkerAlt, faMarker, faTrash, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faLine, faUsps } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import SiteSidebar from '../layout/SiteSidebar';
import MailerBuffer from './MailerBuffer';
import MailerLayerSelector from './MailerLayerSelector';
import MailerMap from './MailerMap';
import MailerSelection from './MailerSelection'
import MailerAddressSearch from './MailerAddressSearch';
import _ from 'lodash';
import {ToggleButton} from '../components/ToggleButton'
import { CSVLink } from 'react-csv';
import apps from '../data/apps';
import AppIntro from '../components/AppIntro';

const Mailer = ({ session }) => {

  // object to track filters
  const allFilters = {
    'usps-deliverable': {
      icon: faUsps,
      activeText: 'Deliverable addresses only',
      inactiveText: 'All addresses, even undeliverable',
      default: true,
      filterFunction: (a) => a.attributes.DPV_VACANT === 'N'
    }
  }

  // this tool is principally driven by this piece of state
  // which represents represents the current selection area
  const [geom, setGeom] = useState(null)

  // use this boolean to see if the user has access to the mailing list layer
  const [access, setAccess] = useState(false)

  // keep track of mailer mode here:
  // mode 1 is centroid
  // mode 2 is parcel
  let mailerLayers = [
    `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/MailerLayers/FeatureServer/0`, // parcels
    `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/MailerLayers/FeatureServer/1` // centroids
  ]
  const [layer, setLayer] = useState('centroid')

  // mailing list layer.
  // theoretically we can put any layer here to make a generalized selection tool.
  let url = mailerLayers[1]
  let prop = 'geometry'
  // we have to grab slightly different stuff, working with parcel centroid.
  if (layer === 'parcel') {
    url = mailerLayers[0]
    prop = 'centroid'
  }

  // use this to set state of filter toggles
  let defaults = {}
  Object.keys(allFilters).forEach(f => {
    defaults[f] = allFilters[f].default
  })
  const [filters, setFilters] = useState(defaults)
  // store the selection area object IDs, all addresses, and the filtered addresses.
  const [resultIds, setResultIds] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [filtered, setFiltered] = useState([])

  // draw mode
  // should be one of these: https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/API.md#modes
  const [mode, setMode] = useState('simple_select')



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
    setAddresses([])
    setFiltered([])
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
        inSR: 4326,
        outSR: 4326,
        httpMethod: "POST",
        returnCentroid: layer === 'parcel' ? true : false,
        authentication: session
      }).then(d => {
        setResultIds(d)
      })
    }
  }, [geom, access, session, url, layer])

  useEffect(() => {
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
          returnCentroid: layer === 'parcel' ? true : false,
          inSR: 4326,
          outSR: 4326,
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
    if (resultIds && resultIds.objectIds.length > 0) {
      fetchAddresses()
    }
  }, [resultIds])

  // if our filters or addresses change,
  // run the new addresses through the new filters
  useEffect(() => {
    let filteredAddresses = addresses
    Object.keys(filters).forEach(k => {
      if(filters[k]) {
        filteredAddresses = filteredAddresses.filter(allFilters[k].filterFunction)
      }
    })
    setFiltered(filteredAddresses)
  }, [filters, addresses])

  let formattedData = filtered.map((r, i) => {
    return r.attributes
  })

  console.log(filtered)
  let features = filtered.map(f => {
    return {
      type: "Feature",
      properties: {...f.attributes},
      geometry: {
        type: "Point",
        coordinates: [parseFloat(f[prop].y.toFixed(6)), parseFloat(f[prop].x.toFixed(6))]
      }
    }
  })
  let featureCollection = {
    type: "FeatureCollection",
    features: features
  }

  let gjDownload = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(featureCollection))

  return (
    <>

      <SiteSidebar title="Mailer">

        {/* <AppIntro app={apps.mailer}>
        </AppIntro> */}

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

        <section className="sidebar-section">

        <div className="flex w-3/4 items-center justify-around">

        <ToggleButton
          title={`Centroid mode (fast)`}
          active={layer === 'centroid'}
          onClick={() => setLayer('centroid') && setResultIds(null) && setAddresses([]) && setFiltered([])}
          />
        <ToggleButton
          title={`Parcel mode (slower)`}
          active={layer === 'parcel'}
          onClick={() => setLayer('parcel') && setResultIds(null) && setAddresses([]) && setFiltered([])}
          />
          </div>
          </section>

        {/* Boundary picker */}
        {!geom &&
        <>
          <section className="sidebar-section">
            <h2>Draw your own shape</h2>
            <div className="flex items-center">
              <Button text='Draw a polygon' icon={faDrawPolygon} onClick={() => setMode('draw_polygon')} small className="mr-2" />
              <Button text='Draw a line' icon={faSlash} onClick={() => setMode('draw_line_string')} small className="mr-2"/>
              <Button text='Create a point' icon={faMapMarkerAlt} onClick={() => setMode('draw_point')} small />
            </div>
          </section>
          <MailerAddressSearch {...{geom, setGeom}} />
          <MailerLayerSelector {...{ geom, setGeom }} />
        </>
        }

        {/* If we have a shape, display buffer tool, current selection */}
        {geom && <MailerBuffer {...{ geom, setGeom }} />}
        {geom && resultIds && <MailerSelection {...{ geom, setGeom, resultIds }} />}

        {/* If there's a shape and access to the layer */}
        {geom && access &&
          <section className="sidebar-section">


            {!resultIds && geom && geom.features[0].geometry.type === 'Polygon' && <h1>Loading...</h1>}

            {/* If we're waiting on result IDs, show a Loading message */}
            {!resultIds && geom && (geom.features[0].geometry.type === 'Point' || geom.features[0].geometry.type === 'LineString') && <h1>Apply a buffer to this geometry to generate a mailing list area.</h1>}

            {/* If we have result IDs, show the export portion. */}
            {resultIds &&
              <>
                <h2>Address filtering options</h2>
                <h3 className="text-sm text-gray-500">{resultIds && addresses.length === 0 ? `Loading all addresses...` : `Fetched ${addresses.length.toLocaleString()} total addresses`}</h3>
                {
                  Object.keys(filters).map(f => (
                    <div key={f} className="flex my-4">
                      <ToggleButton
                        title={allFilters[f].activeText}
                        active={filters[f]}
                        onClick={() => {
                          let filterCopy = _.cloneDeep(filters)
                          filterCopy[f] = !filters[f]
                          setFilters(filterCopy)
                        }}
                        />
                      <ToggleButton
                        title={allFilters[f].inactiveText}
                        active={!filters[f]}
                        onClick={() => {
                          let filterCopy = _.cloneDeep(filters)
                          filterCopy[f] = !filters[f]
                          setFilters(filterCopy)
                        }}
                        />
                    </div>
                  ))
                }
                  <h2>Downloading {filtered.length.toLocaleString()} addresses</h2>
                <div className="flex flex-row">
                  <CSVLink data={formattedData} filename={`mailing_list_${new Date().getTime()}.csv`} className="mr-2">
                    <Button 
                      icon={faDownload} 
                      text={`Download .csv`}
                      small />
                  </CSVLink>
                  <a href={`data: '${gjDownload}`} download={`mailing_list_${new Date().getTime()}.json`}>

                  <Button
                    icon={faGlobe}
                    text={`Download GeoJSON`}
                    small />
                    </a>
                </div>


              </>
            }
          </section>
        }

      </SiteSidebar>

      <main>
        <MailerMap {...{ geom, setGeom, filtered, mode, setMode }} />
      </main>

    </>
  )
}

export default Mailer;