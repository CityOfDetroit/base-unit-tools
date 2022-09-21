

import mapboxgl from 'mapbox-gl';
import { useEffect, useState } from 'react';
import { baseStyle } from '../styles/mapstyle';

const AddressMap = ({ center, parcelId, buildingId, streetId }) => {

  let [theMap, setTheMap] = useState(null)

  useEffect(() => {

    var map = new mapboxgl.Map({
      container: "map", // container id
      style: baseStyle, // stylesheet location
      center: center,
      zoom: 18,
      interactive: false,
      fitBoundsOptions: {
        padding: 50
      },
    });

    setTheMap(map)

    if(parcelId) {
      
    }
    map.setFilter()

  }, [])

  useEffect(() => {
    if(theMap) {
      theMap.setCenter(center)
    }
  }, [center])

  return (
    <div id="map" style={{height: 400, width: 400}}></div>
  )
}

export default AddressMap;