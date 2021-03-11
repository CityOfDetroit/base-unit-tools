import React, { useState, useEffect } from 'react';

import mapboxgl from "mapbox-gl";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import bbox from '@turf/bbox'
import area from '@turf/area'
import simplify from '@turf/simplify'

import { geojsonToArcGIS } from '@esri/arcgis-to-geojson-utils';
import { getLayer, queryFeatures } from '@esri/arcgis-rest-feature-layer'

import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import mapStyle from '../styles/mailerstyle.json'
import SiteSidebar from '../layout/SiteSidebar'

const presets = {
  "neighborhoods": {
    name: "Neighborhoods",
    singular: 'neighborhood',
    pickColumn: 'name',
    url: "https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/Neighborhoods/FeatureServer/0/"
  },
  "cbo": {
    name: "CBOs",
    singular: 'CBO area',
    url: "https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/CBO_Impact_Areas/FeatureServer/0/",
    pickColumn: "Name",
  },
  "historic_districts": {
    name: "Historic Districts",
    singular: 'historic district',
    pickColumn: "Name",
    url: "https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/Detroit_Local_Historic_Districts/FeatureServer/0/"
  }
}

const MailingMap = ({ geom, setGeom }) => {

  let [theMap, setTheMap] = useState(null);
  let [theDraw, setTheDraw] = useState(null)

  useEffect(() => {

    const detroitBbox = [-83.287803, 42.255192, -82.910451, 42.45023];

    var map = new mapboxgl.Map({
      container: "map",
      style: mapStyle,
      bounds: detroitBbox
    });

    let Draw = new MapboxDraw();
    setTheDraw(Draw)

    map.addControl(Draw, 'top-left')

    map.on("load", e => {
      setTheMap(map);
      map.resize();
    });

    map.on("draw.create", e => {
      let geometry = Draw.getAll()
      setGeom(geometry)
      map.fitBounds(bbox(geometry), { padding: 20 })
    })

    map.on("draw.update", e => {
      setGeom(Draw.getAll())
    })

    map.on("draw.modechange", e => {
      if (Draw.getAll().features.length > 1 && e.mode.slice(0, 4) === 'draw') {
        Draw.delete(Draw.getAll().features[0].id)
      }
    })
  }, []);

  useEffect(() => {
    if (theMap && theDraw && geom) {
      theMap.fitBounds(bbox(geom), { padding: 40 })
      theDraw.set(geom)
      theDraw.changeMode("simple_select")
    }
    if (theMap && theDraw && !geom) {
      // theDraw.delete(theDraw.getAll().features[0].id)
    }
  }, [geom])

  return (
    <div id="map" className="explorer-map" />
  )
}


const Mailer = ({ session }) => {

  const [geom, setGeom] = useState(null)
  const [access, setAccess] = useState(false)
  const [currentLayer, setCurrentLayer] = useState('')
  const [layerFeatures, setLayerFeatures] = useState([])
  const [currentFeature, setCurrentFeature] = useState(null)
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
  }, [geom])

  useEffect(() => {
    if (currentLayer !== '') {
      queryFeatures({
        url: presets[currentLayer].url,
        geometryPrecision: 5,
        f: 'geojson'
      }).then(d => {
        setLayerFeatures(d.features)
      })
    }
  }, [currentLayer])

  const fetchAddresses = () => {
    const chunkSize = 500
    let breakpoints = resultIds.objectIds.filter((oid, i) => i % chunkSize === 0)
    breakpoints.push(resultIds.objectIds.slice(-1,)[0])
    let results = breakpoints.map((b, i) => {
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
          return d.features
        }
        )
      }
    })
  }

  return (
    <>
      <SiteSidebar title="Mailer">
        <section className="sidebar-section">
          <h2>Mailer</h2>
          <div className="flex items-center justify-between">
          </div>
        </section>
        <section className="sidebar-section">
          <h2>Choose a layer</h2>

          <select className="p-2 m-2" onChange={(e) => setCurrentLayer(e.target.value)} value={currentLayer} >
            <option value=''>Please choose a layer</option>
            {Object.keys(presets).map(l => (
              <option value={l}>{presets[l].name}</option>
            ))}
          </select>

          {layerFeatures.length > 0 && <select className="p-2 m-2" onChange={(e) => {
            let matching = layerFeatures.filter(ft => { return ft.id === parseInt(e.target.value) })
            setCurrentFeature(simplify(matching[0], { tolerance: 0.0001 }))
            setResultIds(null)
            setGeom({type: "FeatureCollection", features: [simplify(matching[0], { tolerance: 0.00005 })]})
          }} >
            <option value=''>Please choose a {presets[currentLayer].singular}</option>
            {layerFeatures.map(ft => (
              <option value={ft.id}>{ft.properties[presets[currentLayer].pickColumn]}</option>
            ))}
          </select>}

        </section>
        {geom && <section className='sidebar-section'>
          <h2>Current selection: {(area(geom) * 0.000000386102).toFixed(3)} sq. mi.</h2>
          <button className='flex items-center btn-enabled my-2'>
            <FontAwesomeIcon className="text-lg mr-2" icon={faTrash} onClick={() => setGeom(null)} />
            <p>Delete current selection</p>
          </button>
        </section>}
        {!access && <section className="sidebar-section">
          You don't currently have access to this tool.
        </section>}
        {geom && 
          <section className="sidebar-section">
            {!resultIds && currentFeature && <h1>Loading...</h1>}
            {resultIds && 
              <>
              <h2>{resultIds.objectIds.length} addresses in the selection area</h2>
              <button className='btn-enabled my-2' onClick={() => fetchAddresses()}>Get addresses (just in the console for now)</button>
              </>
            }
          </section>
        }
      </SiteSidebar>
      <main>
        <MailingMap {...{ geom, setGeom }} />
      </main>
    </>
  )
}

export default Mailer;