

import mapboxgl from 'mapbox-gl';
import { useEffect, useState } from 'react';
import layers from '../data/layers';
import { baseStyle } from '../styles/mapstyle';
import _ from 'lodash';

const GeocodeCandidateMap = ({ candidate }) => {

  let [theMap, setTheMap] = useState(null)

  useEffect(() => {

    let style = _.cloneDeep(baseStyle)

    style.layers.forEach(lyr => {
      if (lyr.id === layers.parcels.highlight) {
        lyr.filter = ['==', layers.parcels.filter_id, candidate.properties.parcel_id]
      }
      if (lyr.id === layers.buildings.highlight) {
        lyr.filter = ['==', layers.buildings.filter_id, parseInt(candidate.properties.building_id)]
      }
      if (lyr.id === layers.streets.highlight) {
        lyr.filter = ['==', layers.streets.filter_id, parseInt(candidate.properties.street_id)]
      }
      if (lyr.id === layers.addresses.highlight) {
        lyr.filter = ['==', layers.addresses.filter_id, parseInt(candidate.properties.address_id)]
      }
    })

    var map = new mapboxgl.Map({
      container: "map", // container id
      style: style, // stylesheet location
      center: candidate.geometry.coordinates,
      zoom: 17,
      interactive: false,
      fitBoundsOptions: {
        padding: 50
      },
    });

    map.on('load', () => {
      setTheMap(map)
    })

  }, [])

  // useEffect(() => {
  //   if(theMap) {
  //     theMap.setCenter(center)
  //   }
  // }, [center])

  return (
    <div>
      <div id="map" style={{ height: 250 }} />
    </div>
  )
}

export default GeocodeCandidateMap;