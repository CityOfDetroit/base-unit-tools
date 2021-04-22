import { arcgisToGeoJSON } from '@esri/arcgis-to-geojson-utils';
import centroid from '@turf/centroid';
import mapboxgl from "mapbox-gl";
import React, { useEffect, useState } from "react";
import layers from '../data/layers';
import { baseStyle } from '../styles/mapstyle';

const IssueReporterMap = ({ featureCollection, type, target, feature, setMode, mode }) => {


  const [theMap, setTheMap] = useState(null);
  let center = featureCollection.features[0].geometry.coordinates;

  useEffect(() => {
    var map = new mapboxgl.Map({
      container: "map", // container id
      style: baseStyle, // stylesheet location
      center: center, // starting position [lng, lat]
      zoom: 18 // starting zoom
    });

    map.resize();

    map.on("load", () => {
      setTheMap(map);
    });
  }, []);

  useEffect(() => {
    if(theMap && featureCollection.features.length > 0) {
        let c = featureCollection.features[0]
        if(type === 'point') {
          theMap.setFilter("building-highlight", ["==", "$id", c.properties.building_id])
          theMap.setFilter("parcel-highlight", ["==", "parcel_id", c.properties.parcel_id])
          theMap.setFilter("address-highlight", ["==", "$id", c.properties.address_id])
          theMap.setFilter("streets-highlight", ["==", "street_id", c.properties.street_id])
          theMap.setCenter(c.geometry.coordinates)
        }
        if(type === 'centerline') {
          theMap.setFilter("building-highlight", ["==", "$id", ""])
          theMap.setFilter("parcel-highlight", ["==", "parcel_id", ""])
          theMap.setFilter("address-highlight", ["==", "$id", ""])
          theMap.setCenter(c.geometry.coordinates)
        }
    }
    if(theMap && featureCollection.features.length === 0) {
        theMap.setFilter("building-highlight", ["==", "$id", ""])
        theMap.setFilter("parcel-highlight", ["==", "parcel_id", ""])
        theMap.setFilter("address-highlight", ["==", "$id", ""])
    }
  }, [theMap, featureCollection, type])

  useEffect(() => {
    if(theMap) {
      if(feature) {
        let geojsonFeature = arcgisToGeoJSON(feature)
        let coords = centroid(geojsonFeature.geometry).geometry.coordinates
        theMap.easeTo({
          center: coords
        })
        let layer = layers[target.type]
        let others = Object.keys(layers).filter(l => l !== target.type && l !== 'units')
        let filter = ["==", "$id", target.id]
        if(target.type === 'parcels') {
          filter[1] = 'parcel_id'
        }
        if(target.type === 'streets') {
          filter[1] = 'street_id'
          filter[2] = parseInt(target.id)
        }
        if(target.type === 'buildings') {
          filter[2] = parseInt(target.id)
        }
        if(target.type === 'addresses') {
          filter[2] = parseInt(target.id)
        }
        theMap.setFilter(layer.highlight, filter)
        others.forEach(o => {
          theMap.setFilter(layers[o].highlight, ["==", "$id", ""])
        })
      }
    }
  }, [theMap, feature])

  return (
    <div id="map" className="issue-reporter-map" />
  );
};

export default IssueReporterMap;
