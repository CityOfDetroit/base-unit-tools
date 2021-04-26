import mapboxgl from "mapbox-gl";
import React, { useEffect, useState } from "react";
import { arcgisToGeoJSON } from '@esri/arcgis-to-geojson-utils';
import centroid from '@turf/centroid';

import { baseStyle, satelliteStyle, linenStyle } from '../styles/mapstyle'
import videoIcon from '../images/video.png'

import layers from '../data/layers'

const ExplorerMap = ({ clicked, setClicked, linked, feature, showSv, svCoords, svBearing, basemap }) => {

  // keep a reference to the map object here
  const [theMap, setTheMap] = useState(null);
  // keep track of whether the style is loaded or not
  // we switch styles when the underlying basemap changes
  const [loading, setLoading] = useState(false)

  // this effect runs once, when the component loads
  useEffect(() => {

    const detroitBbox = [-83.287803, 42.255192, -82.910451, 42.45023];
    var map = new mapboxgl.Map({
      container: "map", // container id
      style: baseStyle, // stylesheet location
      bounds: detroitBbox,
      fitBoundsOptions: {
        padding: 50
      },
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
      });
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

  // fires when we get a new clicked feature
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

  // fires when we get linked features
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

  // effect fires when svCoords or svBearing changes
  useEffect(() => {
    if (theMap && !loading) {
      if (showSv && svCoords) {
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
      }
      if (!showSv) {
        theMap.getSource("mapillary").setData({
          type: "FeatureCollection", features: []
        })
      }
    }
  }, [svCoords, svBearing, loading, theMap, showSv]);

  // effect fires when the showSv property changes
  useEffect(() => {
    if(theMap && !loading) {
      if (showSv) {
        theMap.setLayoutProperty("mapillary-location", "visibility", showSv ? "visible" : "none")
      }
    }
  }, [showSv, loading, theMap])

  // effect fires when we switch the basemap
  useEffect(() => {
    if (theMap) {
      if (basemap === 'satellite') {
        theMap.setStyle(satelliteStyle())
        setLoading(true)
      }
      if (basemap === 'linen-map') {
        theMap.setStyle(linenStyle())
        setLoading(true)
      }
      if (basemap === 'default') {
        theMap.setStyle(baseStyle)
        setLoading(true)
      }
    }
  }, [basemap])

  useEffect(() => {
    if (theMap) {
      if (feature) {
        let geojsonFeature = arcgisToGeoJSON(feature)
        let coords = centroid(geojsonFeature.geometry).geometry.coordinates
        theMap.easeTo({
          center: coords,
          zoom: 17
        })
      }
    }
  }, [theMap, feature])

  return (
    <div id="map" className="explorer-map" />
  );
};

export default ExplorerMap;
