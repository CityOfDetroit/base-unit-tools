

import mapboxgl from 'mapbox-gl';
import { useEffect } from 'react';
import { baseStyle } from '../styles/mapstyle';

const ValidatorMap = () => {

  useEffect(() => {

    const detroitBbox = [-83.287803, 42.255192, -82.910451, 42.45023];

    var map = new mapboxgl.Map({
      container: "map", // container id
      style: baseStyle, // stylesheet location
      bounds: detroitBbox,
      fitBoundsOptions: {
        padding: 50
      },
    });

  }, [])

  return (
    <div id="map" className="explorer-map"></div>
  )
}

export default ValidatorMap;