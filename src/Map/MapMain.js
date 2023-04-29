import _ from "lodash";
import MapboxGL from "mapbox-gl/dist/mapbox-gl";
import React, { useEffect, useRef } from "react";
import Mapbox from "react-map-gl";
import { baseStyle } from "../styles/mapstyle";
import { arcgisToGeoJSON } from "@esri/arcgis-to-geojson-utils";
import bbox from "@turf/bbox";
import layers from "../data/layers";
import useFeature from "../hooks/useFeature";

const MapMain = ({ feature, setClicked, clicked, linked }) => {

  const map = useRef();

  let style = _.cloneDeep(baseStyle);


  const initialViewState = {
    bounds: [-83.287803, 42.255192, -82.910451, 42.45023],
    fitBoundsOptions: {
      padding: 50,
      maxZoom: 17,
    },
  };
  
  if(feature) {
    let geojsonFeature = arcgisToGeoJSON(feature);
    map.current.fitBounds(bbox(geojsonFeature), {
      padding: 50,
      maxZoom: 18.5,
    });

    let layer = layers[clicked.type]
    if(layer) {
      let layerIndex = style.layers.findIndex(l => l.id === layer.highlight)
      let filter = ["==", layer.filter_id, clicked.type === 'parcels' ? clicked.id : parseInt(clicked.id)]
      style.layers[layerIndex].filter = filter
    }
  }

  if(linked.addresses.length > 0) {
    let layer = layers[clicked.type]
    let others = Object.keys(layers).filter(l => l !== clicked.type && l !== 'units')

    let clickedLayerIndex = style.layers.findIndex(l => l.id === layer.link)
    console.log(clickedLayerIndex)
    style.layers[clickedLayerIndex].filter =  ["==", "$id", ""]

    others.forEach(o => {
      let layerIndex = style.layers.findIndex(l => l.id === layers[o].link)
      console.log(layerIndex)
      let filter;
      if (linked[o].length === 1 && (linked[o][0] === undefined || linked[o][0] === null)) {
        filter = ["==", layers[o].filter_id, ""]
      }
      else {
        filter = ["in", layers[o].filter_id].concat(linked[o])
      }
      style.layers[layerIndex].filter = filter
      console.log(style.layers[layerIndex], filter)
    })
  }


  const handleClick = (e) => {
    let features = map.current.queryRenderedFeatures(e.point, {
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
  };

  const handleDblClick = (e) => {};

  return (
    <Mapbox
      ref={map}
      mapLib={MapboxGL}
      mapStyle={style}
      onDblClick={handleDblClick}
      onClick={handleClick}
      doubleClickZoom={false}
      initialViewState={initialViewState}
      interactiveLayerIds={['address-point', 'building-fill', 'parcel-fill', 'streets-line']}
    ></Mapbox>
  );
};

export default MapMain;
