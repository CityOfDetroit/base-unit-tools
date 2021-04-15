import { arcgisToGeoJSON } from '@esri/arcgis-to-geojson-utils';
import centroid from '@turf/centroid';
import mapboxgl from "mapbox-gl";
import React, { useEffect, useState } from "react";
import layers from '../data/layers';
import { baseStyle } from '../styles/mapstyle';

const IssueReporterMap = ({ response, target, feature, setMode, mode }) => {

  console.log(response, target, feature)
  let {candidates, geocoder} = response
  
  const [theMap, setTheMap] = useState(null);
  
  let center;
  if(candidates.length > 0 && geocoder === 'point') {
    center = [candidates[0].attributes.X, candidates[0].attributes.Y]
  }
  if(candidates.length > 0 && geocoder === 'centerline') {
    center = [candidates[0].location.x, candidates[0].location.y]
  }

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
    if(theMap && candidates.length > 0) {
        let c = candidates[0]
        if(geocoder === 'point') {
          theMap.setFilter("building-highlight", ["==", "$id", c.attributes.building_id])
          theMap.setFilter("parcel-highlight", ["==", "parcel_id", c.attributes.parcel_id])
          theMap.setFilter("address-highlight", ["==", "$id", c.attributes.address_id])
          theMap.setFilter("streets-highlight", ["==", "street_id", c.attributes.street_id])
          theMap.setCenter([c.attributes.X, c.attributes.Y])
        }
        if(geocoder === 'centerline') {
          theMap.setFilter("building-highlight", ["==", "$id", ""])
          theMap.setFilter("parcel-highlight", ["==", "parcel_id", ""])
          theMap.setFilter("address-highlight", ["==", "$id", ""])
          theMap.setCenter([c.location.x, c.location.y])
        }
    }
    if(theMap && candidates.length === 0) {
        theMap.setFilter("building-highlight", ["==", "$id", ""])
        theMap.setFilter("parcel-highlight", ["==", "parcel_id", ""])
        theMap.setFilter("address-highlight", ["==", "$id", ""])
    }
  }, [theMap, candidates, geocoder])

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

  useEffect(() => {
    if(theMap) {
      console.log('new mode: ', mode)
    }
  }, [theMap, mode])

  return (
    <div id="map" className="issue-reporter-map" />
  );
};

export default IssueReporterMap;
