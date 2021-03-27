import mapboxgl from "mapbox-gl";
import React, { useEffect, useState } from "react";
import { arcgisToGeoJSON } from '@esri/arcgis-to-geojson-utils';
import centroid from '@turf/centroid';

import { baseStyle, satelliteStyle } from '../styles/mapstyle'
import videoIcon from '../images/video.png'

import layers from '../data/layers'

const ExplorerMap = ({ clicked, setClicked, linked, feature, showSv, svCoords, svBearing, showSatellite }) => {
  const [theMap, setTheMap] = useState(null);
  const [loading, setLoading] = useState(false)

  // this effect runs once, when the component loads
  useEffect(() => {

    // detroit bbox
    let [xMin, yMin, xMax, yMax] = [-83.237803, 42.355192, -82.910451, 42.45023];
    let xRandomOffset = (xMax - xMin) * Math.random()
    let yRandomOffset = (yMax - yMin) * Math.random()
    let xRandomCenter = xMin + xRandomOffset
    let yRandomCenter = yMin + yRandomOffset

    var map = new mapboxgl.Map({
      container: "map", // container id
      style: baseStyle, // stylesheet location
      center: [xRandomCenter, yRandomCenter], // starting position [lng, lat]
      zoom: 16.25, // starting zoom
      maxZoom: 19.99
    });

    map.resize();

    map.on("load", () => {
      setTheMap(map);
    });

    // when a new style loaders after the user switches styles
    map.on('style.load', () => {
      setLoading(false)

      // load our mapillary video icon in
      map.loadImage(videoIcon, (error, image) => {
        if (error) throw error;
        map.addImage("video", image);

        // set the Mapillary data
        map.getSource("mapillary").setData({
          type: "FeatureCollection",
          // we'll make the map data here
          features: [],
        });
      });
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

  }, [setClicked]);

  useEffect(() => {
    if (theMap && clicked.type && clicked.id && !loading) {
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
  }, [theMap, clicked, loading])

  useEffect(() => {
    if (theMap && linked && clicked.type && !loading) {
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
        theMap.setFilter(layers[o].link, filter)
      })
    }
  }, [theMap, linked, loading, clicked.type])

  useEffect(() => {
    theMap && showSv && svCoords &&
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
  }, [svCoords, svBearing, loading, theMap, showSv]);

  useEffect(() => {
    if (theMap && showSv) {
      theMap.setLayoutProperty("mapillary-location", "visibility", "visible")
    }
    if (theMap && !showSv) {
      theMap.setLayoutProperty("mapillary-location", "visibility", "none")
    }
  }, [showSv, loading, theMap])

  useEffect(() => {
    if (theMap) {
      if (showSatellite) {
        theMap.setStyle(satelliteStyle())
        setLoading(true)
      }
      else {
        theMap.setStyle(baseStyle)
        setLoading(true)
      }
    }
  }, [showSatellite])

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
