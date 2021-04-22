
import mapboxgl from "mapbox-gl";
import React, { useEffect, useState } from "react";
import layers from '../data/layers';
import { baseStyle } from '../styles/mapstyle';

const LinkerMap = ({ center, feature, links, setLinks }) => {

  const [theMap, setTheMap] = useState(null);

  let [parcel, setParcel] = useState(null)
  let [building, setBuilding] = useState(null)
  let [street, setStreet] = useState(null)

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
      map.setFilter("building-highlight", ["==", "$id", feature.properties.bldg_id])
      map.setFilter("parcel-highlight", ["==", "parcel_id", feature.properties.parcel_id])
      map.setFilter("address-highlight", ["==", "$id", feature.properties.addr_id])
      map.setFilter("streets-highlight", ["==", "street_id", feature.properties.street_id])
    });

    map.on('click', e => {
      let features = map.queryRenderedFeatures(e.point, {
        layers: ['building-fill', 'parcel-fill', 'streets-line'],
      });
      if (features.length > 0) {
        let ft = features[0]
        if(ft.source === 'buildings') {
          setBuilding(ft.id)
        }
        if(ft.source === 'parcels') {
          setParcel(ft.properties.parcel_id)
        }
        if(ft.source === 'streets') {
          setStreet(ft.properties.street_id)
        }
      }
      else {
        console.log(`no features`)
      }
    })
  }, []);

  useEffect(() => {
    if(parcel && theMap) {
      links.parcel_id = parcel
      theMap.setFilter("parcel-highlight", ["==", "parcel_id", parcel])

    }
    if(building && theMap) {
      theMap.setFilter("building-highlight", ["==", "$id", building])
      links.bldg_id = building
    }
    if(street && theMap) {
      links.street_id = street
      theMap.setFilter("streets-highlight", ["==", "street_id", street])
    }
    setLinks({
      ...links
    })
  }, [parcel, building, street])

  return (
    <div id="map" className="linker-map" />
  );
};

export default LinkerMap;
