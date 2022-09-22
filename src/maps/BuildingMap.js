import centroid from "@turf/centroid";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState } from "react";
import { baseStyle, satelliteStyle } from '../styles/mapstyle';

import layers from "../data/layers";

const BuildingMap = ({ geojson }) => {

  let [satellite, setSatellite] = useState(false)
  let [loading, setLoading] = useState(true)
  let [theMap, setTheMap] = useState(null);
  let center = centroid(geojson).geometry.coordinates;

  baseStyle.layers.forEach((l, i) => {
    if(l.id === layers.buildings.highlight) {
      baseStyle.layers[i].filter = ["==", layers.buildings.filter_id, geojson.properties[layers.buildings.id_column]]
    }
  })

  console.log(baseStyle)

  useEffect(() => {

    var map = new mapboxgl.Map({
      container: "map", // container id
      style: baseStyle, // stylesheet location
      center: center,
      zoom: 17,
      interactive: false,
      fitBoundsOptions: {
        padding: 50,
      },
    });

    map.addControl(new mapboxgl.NavigationControl({showCompass: false}), 'top-left');

    map.on('load', () => {
      setLoading(false)
      setTheMap(map);
    })

    map.on('style.load', () => {
      setLoading(false)
    })


  }, []);

  useEffect(() => {
    if (theMap) {
      theMap.setCenter(center);
    }
  }, [center]);


  // effect fires when we switch the basemap
  useEffect(() => {
    if (theMap) {
      if (satellite) {
        let style = satelliteStyle()
        style.layers.forEach((l, i) => {
          if(l.id === layers.buildings.highlight) {
            style.layers[i].filter = ["==", layers.buildings.filter_id, geojson.properties[layers.buildings.id_column]]
          }
        })

        theMap.setStyle(style)
        setLoading(true)
      }
      if (!satellite) {
        baseStyle.layers.forEach((l, i) => {
          if(l.id === layers.buildings.highlight) {
            baseStyle.layers[i].filter = ["==", layers.buildings.filter_id, geojson.properties[layers.buildings.id_column]]
          }
        })
        theMap.setStyle(baseStyle)
        setLoading(true)
      }
    }
  }, [satellite])

  useEffect(() => {
    console.log(satellite)
  }, [satellite])

  return (
    <div>
    <span onClick={() => setSatellite(!satellite)}>Click me for satellite</span>
    <div id="map" style={{ height: 300 }} />
    </div>
  );
};

export default BuildingMap;
