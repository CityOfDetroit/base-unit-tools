import mapboxgl from "mapbox-gl";
import React, { useEffect, useState } from "react";
import { arcgisToGeoJSON } from '@esri/arcgis-to-geojson-utils';
import centroid from '@turf/centroid';
import _ from 'lodash';
import "mapbox-gl/dist/mapbox-gl.css";

import { baseStyle, satelliteStyle, linenStyle } from '../styles/mapstyle'
import videoIcon from '../images/video.png'

import layers from '../data/layers'

const ExplorerMap = ({ clicked, setClicked, geocoded, linked, feature, showSv, svBearing, basemap, svImage, setSvImages }) => {

  // keep a reference to the map object here
  const [theMap, setTheMap] = useState(null);
  // keep track of whether the style is loaded or not
  // we switch styles when the underlying basemap changes
  const [loading, setLoading] = useState(true)

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

    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        fitBoundsOptions: {
          maxZoom: 18.5
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true
      })
    );

    map.addControl(new mapboxgl.NavigationControl({showCompass: false}), 'top-left');

    map.on("load", () => {
      setTheMap(map);
    });

    // when a new style loaders after the user switches styles
    map.on('style.load', () => {
      setLoading(false)

      console.log(videoIcon)
      // load our mapillary video icon in
      // map.loadImage(videoIcon, (error, image) => {
      //   if (error) throw error;
      //   map.addImage("video", image);
      // });
    })

    map.on('click', e => {
      let features = map.queryRenderedFeatures(e.point, {
        layers: ['address-point', 'building-fill', 'parcel-fill', 'streets-line'],
      });
      if (features.length > 0) {
        let f = features[0]
        let l = layers[f.sourceLayer]
        setClicked({
          type: f.sourceLayer,
          id: l.click === 'id' ? f.id : f.properties[l.click]
        })
      }
      else {
      }
    })

    map.on('moveend', e => {
      if (map.getZoom() > 17.5) {
        let features = map.queryRenderedFeatures({
          layers: ['mapillary-images']
        })
        let uniqs = _.uniqBy(features, 'properties.id')
        setSvImages(uniqs)
      }
    })

    map.on('sourcedata', e => {
      if (e.sourceId === 'mly' && e.isSourceLoaded === true && map.getZoom() > 17.5) {
        let features = map.queryRenderedFeatures({
          layers: ['mapillary-images']
        })
        setSvImages(_.uniqBy(features, 'properties.id'))
        console.log(features.sort((a, b) => a.properties.captured_at - b.properties.captured_at))
      }
    })

  }, [setClicked]);

  // fires when we get a new clicked feature
  useEffect(() => {
    if (theMap && clicked.type && clicked.id && !loading) {
      let layer = layers[clicked.type]
      let others = Object.keys(layers).filter(l => l !== clicked.type && l !== 'units')
      let filter = ["==", layer.filter_id, clicked.type === 'parcels' ? clicked.id : parseInt(clicked.id)]
      theMap.setFilter(layer.highlight, filter)
      console.log("Others")
      console.log(others)
      others.forEach(o => {
        theMap.setFilter(layers[o].highlight, ["==", "$id", ""])
      })
    }
  }, [theMap, clicked, loading])

  // fires when we get a new geocoded feature
  useEffect(() => {
    if (theMap && geocoded && geocoded.features.length > 0 && !loading) {
      theMap.easeTo({
        center: geocoded.features[0].geometry.coordinates,
        zoom: theMap.getZoom() < 17 ? 17 : theMap.getZoom()
      })
    }
  }, [theMap, geocoded, loading])

  // fires when we get linked features
  useEffect(() => {
    if (theMap && linked && clicked.type && !loading) {
      let layer = layers[clicked.type]
      let others = Object.keys(layers).filter(l => l !== clicked.type && l !== 'units')

      // set our clickedType link to null
      theMap.setFilter(layer.link, ["==", "$id", ""])

      // loop thru the others and get their linked
      //TODO: adjust this to work for the business truth datasets
      /*others.forEach(o => {
        let filter;
        if (linked[o].length === 1 && (linked[o][0] === undefined || linked[o][0] === null)) {
          filter = ["==", layers[o].filter_id, ""]
        }
        else {
          filter = ["in", layers[o].filter_id].concat(linked[o])
        }
        theMap.setFilter(layers[o].link, filter)
      })*/
    }
  }, [theMap, linked, loading, clicked.type])

  useEffect(() => {
    if (theMap && svImage) {
      theMap.setFilter('mapillary-location', ["==", "id", parseInt(svImage.properties.id)])
      theMap.setLayoutProperty('mapillary-location', 'icon-rotate', (svBearing - 90))
    }
  }, [svImage, svBearing])

  // effect fires when the showSv property changes
  useEffect(() => {
    if (theMap && !loading) {
      if (showSv) {
        theMap.setLayoutProperty("mapillary-location", "visibility", "visible")
        theMap.flyTo({
          zoom: 19
        })
      }
      else {
        theMap.setLayoutProperty("mapillary-location", "visibility", "none")
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
      if (feature && feature.geometry) {
        let geojsonFeature = arcgisToGeoJSON(feature)
        let coords = centroid(geojsonFeature.geometry).geometry.coordinates
        theMap.easeTo({
          center: coords,
          zoom: theMap.getZoom() < 17 ? 17 : theMap.getZoom()
        })
      }
    }
  }, [theMap, feature])

  return (
    <div id="map" className="explorer-map" />
  );
};

export default ExplorerMap;
