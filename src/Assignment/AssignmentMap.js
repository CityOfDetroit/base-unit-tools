import mapboxgl from 'mapbox-gl';
import { useEffect, useState } from 'react';
import { baseStyle } from '../styles/mapstyle';
import layers from '../data/layers.js'

const AssignmentMap = ({ mode, geocodeResult, setBuilding, setParcel, setStreet, selectableLayers, building, parcel, street, addresses, setCenter }) => {

  let feature;
  if (geocodeResult) {
    feature = geocodeResult.features[0]
  }

  let [theMap, setTheMap] = useState(null)

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

      //   map.addLayer({
      //     id: "address-label",
      //     "source": "addresses",
      //     "source-layer": "addresses",
      //     type: "symbol",
      //     minzoom: 18,
      //     layout: {
      //       "text-field": ["get", "parcel_id"],
      //       "text-font": ["Montserrat Regular"]
      //     }
      //   })

      //   map.setLayoutProperty("address-point", "visibility", "visible")

    })

    map.on('click', e => {
      let features = map.queryRenderedFeatures(e.point, {
        layers: [layers.buildings.interaction, layers.streets.interaction, layers.parcels.interaction],
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

  return (
    <div id="map" className="assignment-map"></div>
  )
}

export default AssignmentMap;