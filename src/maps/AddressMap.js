import centroid from "@turf/centroid";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState } from "react";
import { baseStyle, satelliteStyle } from "../styles/mapstyle";

import layers from "../data/layers";
import AerialControl from "./AerialControl";

const AddressMap = ({ geojson }) => {
  let [aerial, setAerial] = useState(false);
  let [loading, setLoading] = useState(true);
  let [theMap, setTheMap] = useState(null);
  let center = centroid(geojson).geometry.coordinates;

  baseStyle.layers.forEach((l, i) => {
    if (l.id === layers.addresses.highlight) {
      baseStyle.layers[i].filter = [
        "==",
        layers.addresses.filter_id,
        geojson.properties[layers.addresses.id_column],
      ];
    }
  });

  console.log(baseStyle);

  useEffect(() => {
    var map = new mapboxgl.Map({
      container: "map", // container id
      style: baseStyle, // stylesheet location
      center: center,
      zoom: 17.5,
      interactive: true,
      fitBoundsOptions: {
        padding: 50,
      },
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-left");

    map.on("load", () => {
      setLoading(false);
      setTheMap(map);
    });

    map.on("style.load", () => {
      setLoading(false);
    });
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
        let style = satelliteStyle();
        style.layers.forEach((l, i) => {
          if (l.id === layers.addresses.highlight) {
            style.layers[i].filter = [
              "==",
              layers.addresses.filter_id,
              geojson.properties[layers.addresses.id_column],
            ];
          }
        });

        theMap.setStyle(style);
        setLoading(true);
      }
      if (!aerial) {
        baseStyle.layers.forEach((l, i) => {
          if (l.id === layers.addresses.highlight) {
            baseStyle.layers[i].filter = [
              "==",
              layers.addresses.filter_id,
              geojson.properties[layers.addresses.id_column],
            ];
          }
        });
        theMap.setStyle(baseStyle);
        setLoading(true);
      }
    }
  }, [aerial]);

  return (
    <div className="bg-gray-100">
      <div className="flex items-center justify-between p-2">
        <p className="font-semibold">Map</p>
      </div>
      <div id="map" style={{ height: 350 }} />
      <div>
        <AerialControl {...{aerial, setAerial}} />
      </div>
    </div>
  );
};

export default AddressMap;
