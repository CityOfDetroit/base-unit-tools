import mapboxgl from 'mapbox-gl';
import { useEffect, useState } from 'react';
import { baseStyle } from '../styles/mapstyle';

const AssignmentMap = ({ geocodeResult, setBuilding, setParcel, setStreet, selectableLayer }) => { 

    let feature;
  if(geocodeResult) {
      feature = geocodeResult.features[0]
  }

  let [theMap, setTheMap] = useState(null)

  useEffect(() => {

    const detroitBbox = [-83.287803, 42.255192, -82.910451, 42.45023];

    var map = new mapboxgl.Map({
      container: "map", // container id
      style: baseStyle, // stylesheet location
      bounds: detroitBbox,
      zoom: 17
    });

    map.on('load', () => {

      setTheMap(map)

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
        layers: ['building-fill'],
      });
      if (features.length > 0) {
        let clicked = features[0]
        console.log(clicked.properties.bldg_id)
        setBuilding(clicked.properties.bldg_id)
        map.setFilter("building-highlight", ['==', "bldg_id", clicked.properties.bldg_id])
      }
      else {
      }
    })
  }, [])

  useEffect(() => {
    if(theMap && geocodeResult && feature) {

      theMap.flyTo({
          center: feature.geometry.coordinates,
          zoom: 17
        })


      theMap.getSource("result").setData(geocodeResult)

    }
  }, [geocodeResult])

  return (
    <div id="map" className="explorer-map"></div>
  )
}

export default AssignmentMap;