import mapboxgl from 'mapbox-gl';
import { useEffect, useState } from 'react';
import layers from '../data/layers.js'
import { baseStyle, satelliteStyle, linenStyle } from '../styles/mapstyle'

const AssignmentMap = ({ mode, geocodeResult, setBuilding, setParcel, setStreet, selectableLayers, building, parcel, street, addresses, setCenter, basemap }) => {

  let feature;
  if (geocodeResult) {
    feature = geocodeResult.features[0]
  }

  let [theMap, setTheMap] = useState(null)

  // keep track of whether the style is loaded or not
  // we switch styles when the underlying basemap changes
  const [loading, setLoading] = useState(false)

  useEffect(() => {

    // const detroitBbox = [-83.287803, 42.255192, -82.910451, 42.45023];

    var map = new mapboxgl.Map({
      container: "map", // container id
      style: baseStyle, // stylesheet location
      // bounds: detroitBbox,
      center: [-83.1, 42.35],
      zoom: 17
    });

    map.on('load', () => {

      setTheMap(map)

      setCenter(map.getCenter())

      map.addSource("result", {
        type: "geojson",
        data: geocodeResult
      })

      map.addLayer({
        id: "result-point",
        source: "result",
        type: "circle",
        paint: {
          "circle-color": "green"
        }
      })

      map.setLayoutProperty("address-point", "visibility", "visible")
      map.setLayoutProperty("address-point-label", "visibility", "visible")

      //   map.setLayoutProperty("address-point", "visibility", "visible")

    })

    map.on('click', e => {
      let features = map.queryRenderedFeatures(e.point, {
        layers: [layers.buildings.interaction, layers.streets.interaction, layers.parcels.interaction, layers.addresses.interaction],
      });
      if (features.length > 0) {
        let clicked = features[0]
        if (clicked.sourceLayer === 'parcels') {
          setParcel(clicked.properties[layers.parcels.click])
        }
        if (clicked.sourceLayer === 'buildings') {
          setBuilding(clicked.properties[layers.buildings.click])
        }
        if (clicked.sourceLayer === 'streets') {
          setStreet(clicked.properties[layers.streets.click])
        }
        if (clicked.sourceLayer === 'addresses') {
        }
      }
      else {
      }
    })

    map.on('moveend', e => {
      setCenter(map.getCenter())
    })
  }, [])

  useEffect(() => {
    if (theMap && geocodeResult && feature) {

      theMap.flyTo({
        center: feature.geometry.coordinates,
        zoom: 17
      })


      theMap.getSource("result").setData(geocodeResult)

    }
  }, [geocodeResult])

  useEffect(() => {
    if (theMap) {
      let layerValues = {
        'buildings': building,
        'streets': street,
        'parcels': parcel,
      }
      Object.keys(layerValues).forEach(l => {
        if (selectableLayers.indexOf(layers[l].interaction) > -1) {
          theMap.setFilter(layers[l].highlight, ['==', layers[l].id_column, layerValues[l]])
        }
        else {
          theMap.setFilter(layers[l].highlight, [
            '==',
            layers[l].id_column,
            ''
          ])
        }
      })
    }
  }, [building, parcel, street, mode, selectableLayers])

  useEffect(() => {
    if (theMap) {
      theMap.setFilter(layers.addresses.highlight, ['in', layers.addresses.id_column].concat(addresses.map(a => a.addr_id)))
    }
  }, [addresses])

  // effect fires when we switch the basemap
  useEffect(() => {
    if (theMap) {
      if (basemap === 'satellite') {
        theMap.setStyle(satelliteStyle())
        setLoading(true)
      }
      if (basemap === 'linen-map') {
        theMap.setStyle(linenStyle())
        setLoading(true)
      }
      if (basemap === 'default') {
        theMap.setStyle(baseStyle)
        setLoading(true)
      }
    }
  }, [basemap])

  return (
    <div id="map" className="assignment-map"></div>
  )
}

export default AssignmentMap;