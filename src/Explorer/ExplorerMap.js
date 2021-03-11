import mapboxgl from "mapbox-gl";
import React, { useEffect, useState } from "react";
import { arcgisToGeoJSON } from '@esri/arcgis-to-geojson-utils';
import centroid from '@turf/centroid';

import mapStyle from '../styles/mapstyle'
import videoIcon from '../images/video.png'

import layers from '../data/layers.json'

const ExplorerMap = ({ clicked, setClicked, linked, feature, showSv, svCoords, svBearing }) => {
  const [theMap, setTheMap] = useState(null);

  // detroit bbox
  let [xMin, yMin, xMax, yMax] = [-83.237803, 42.355192, -82.910451, 42.45023];
  let xRandomOffset = (xMax - xMin) * Math.random()
  let yRandomOffset = (yMax - yMin) * Math.random()
  let xRandomCenter = xMin + xRandomOffset
  let yRandomCenter = yMin + yRandomOffset

  useEffect(() => {
    var map = new mapboxgl.Map({
      container: "map", // container id
      style: mapStyle, // stylesheet location
      center: [xRandomCenter, yRandomCenter], // starting position [lng, lat]
      zoom: 16.25, // starting zoom
      maxZoom: 19.99
    });

    map.resize();

    map.on("load", () => {
      setTheMap(map);
    });

    map.on('style.load', () => {
      map.loadImage(videoIcon, (error, image) => {
        if (error) throw error;
        map.addImage("video", image);
        svCoords && map.getSource("mapillary").setData({
          type: "FeatureCollection",
          // we'll make the map data here
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [svCoords.lon, svCoords.lat],
              },
              properties: {
                bearing: svBearing - 90,
              },
            },
          ],
        });
      });
    })

    map.on('style.load', () => {
    })

    map.on('moveend', (e) => {
    })

    map.on('click', e => {
      let features = map.queryRenderedFeatures(e.point, {
        layers: ['address-point', 'building-fill', 'parcel-fill', 'streets-line'],
      });
      if (features.length > 0) {
        let f = features[0]
        let l = layers[f.source]
        setClicked({
          type: f.source,
          id: l.click === 'id' ? f.id : f.properties[l.click]
        })
      }
      else {
      }
    })

  }, []);

  useEffect(() => {
    if (theMap && clicked.type && clicked.id) {
      let layer = layers[clicked.type]
      let others = Object.keys(layers).filter(l => l !== clicked.type && l !== 'units')
      let filter = ["==", "$id", clicked.id]
      if (clicked.type === 'parcels') {
        filter[1] = 'parcel_id'
      }
      if (clicked.type === 'streets') {
        filter[1] = 'street_id'
        filter[2] = parseInt(clicked.id)
      }
      if (clicked.type === 'buildings') {
        filter[2] = parseInt(clicked.id)
      }
      if (clicked.type === 'addresses') {
        filter[2] = parseInt(clicked.id)
      }
      theMap.setFilter(layer.highlight, filter)
      others.forEach(o => {
        theMap.setFilter(layers[o].highlight, ["==", "$id", ""])
      })
    }
  }, [theMap, clicked])

  useEffect(() => {
    if (theMap && linked && clicked.type) {
      console.log(linked)
      let layer = layers[clicked.type]
      let others = Object.keys(layers).filter(l => l !== clicked.type && l !== 'units')

      // set our clickedType link to null
      theMap.setFilter(layer.link, ["==", "$id", ""])

      // loop thru the others and get their linked
      others.forEach(o => {
        let filter;
        if (linked[o].length === 1 && (linked[o][0] === undefined || linked[o][0] === null)) {
          filter = ["==", layers[o].filter_id, ""]
        }
        else {
          filter = ["in", layers[o].filter_id].concat(linked[o]) 
        }
        console.log(filter)
        theMap.setFilter(layers[o].link, filter)
      })
      // let filter = ["==", "$id", clicked.id]
      // if (clicked.type === 'parcels') {
      //   filter[1] = 'parcel_id'
      // }
      // if (clicked.type === 'streets') {
      //   filter[1] = 'street_id'
      //   filter[2] = parseInt(clicked.id)
      // }
      // if (clicked.type === 'buildings') {
      //   filter[2] = parseInt(clicked.id)
      // }
      // if (clicked.type === 'addresses') {
      //   filter[2] = parseInt(clicked.id)
      // }
      // theMap.setFilter(layer.link, filter)
      // others.forEach(o => {
      //   theMap.setFilter(layers[o].link, ["==", "$id", ""])
      // })
    }
  }, [theMap, linked])

  useEffect(() => {
    console.log(svCoords, svBearing);
    theMap && showSv &&
      theMap.getSource("mapillary").setData({
        type: "FeatureCollection",
        // we'll make the map data here
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [svCoords.lon, svCoords.lat],
            },
            properties: {
              bearing: svBearing - 90,
            },
          },
        ],
      });
    if (theMap && !showSv) {
      theMap.getSource("mapillary").setData({
        type: "FeatureCollection", features: []
      })
    }
  }, [svCoords, svBearing]);

  useEffect(() => {
    if(theMap && showSv) {
      theMap.setLayoutProperty("mapillary-location", "visibility", "visible")
    }
    if(theMap && !showSv) {
      theMap.setLayoutProperty("mapillary-location", "visibility", "none")
    }
  }, [showSv])

  useEffect(() => {
    if (theMap) {
      if (feature) {
        let geojsonFeature = arcgisToGeoJSON(feature)
        let coords = centroid(geojsonFeature.geometry).geometry.coordinates
        theMap.easeTo({
          center: coords
        })
      }
    }
  }, [theMap, feature])

  return (
    <div id="map" className="explorer-map" />
  );
};

export default ExplorerMap;
