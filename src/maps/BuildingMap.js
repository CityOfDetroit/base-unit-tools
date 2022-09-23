import centroid from "@turf/centroid";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState } from "react";
import { baseStyle, satelliteStyle } from '../styles/mapstyle';
import _ from 'lodash';
import layers from "../data/layers";
import AerialControl from "./AerialControl";
import bbox from "@turf/bbox";

const BuildingMap = ({ geojson }) => {

  let [aerial, setAerial] = useState(false)
  let [loading, setLoading] = useState(true)
  let [theMap, setTheMap] = useState(null);
  let center = centroid(geojson).geometry.coordinates;

  let style = _.cloneDeep(baseStyle)

  style.layers.forEach((l, i) => {
    if(l.id === layers.buildings.highlight) {
      style.layers[i].filter = ["==", layers.buildings.filter_id, geojson.properties[layers.buildings.id_column]]
    }
  })

  useEffect(() => {

    var map = new mapboxgl.Map({
      container: "map", // container id
      style: style, // stylesheet location
      bounds: bbox(geojson),
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
      if (aerial) {
        let style = satelliteStyle()
        style.layers.forEach((l, i) => {
          if(l.id === layers.buildings.highlight) {
            style.layers[i].filter = ["==", layers.buildings.filter_id, geojson.properties[layers.buildings.id_column]]
          }
        })

        theMap.setStyle(style)
        setLoading(true)
      }
      if (!aerial) {
        baseStyle.layers.forEach((l, i) => {
          if(l.id === layers.buildings.highlight) {
            baseStyle.layers[i].filter = ["==", layers.buildings.filter_id, geojson.properties[layers.buildings.id_column]]
          }
        })
        theMap.setStyle(baseStyle)
        setLoading(true)
      }
    }
  }, [aerial])

  return (
    <div>
      <div id="map" style={{ height: 250 }} />
      <div className="my-1">
        <AerialControl {...{ aerial, setAerial }} />
      </div>
    </div>
  );
};

export default BuildingMap;
