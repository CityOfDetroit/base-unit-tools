import { queryFeatures } from "@esri/arcgis-rest-feature-layer";
import { geocode } from "@esri/arcgis-rest-geocoding";
import bbox from "@turf/bbox";
import _ from "lodash";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { useRef, useState } from "react";
import Mapbox from "react-map-gl";
import layers from "../data/layers";
import { geocoders } from "../hooks/useGeocoder";
import { baseStyle } from "../styles/mapstyle";

const BaseUnitsMap = ({ feature, selectFeature, setSelectFeature, linked }) => {
  let featureId = selectFeature.id;
  let featureType = selectFeature.type;

  let style = _.cloneDeep(baseStyle);

  // highlight the selected feature
  if (featureId && featureType) {
    let layer = layers[featureType];
    let id = featureType === "parcels" ? featureId : parseInt(featureId);
    let filter = ["==", layer.filter_id, id];
    style.layers.find((l) => l.id === layer.highlight).filter = filter;
  }

  if (linked) {
    let layer = layers[featureType];
    let others = Object.keys(layers).filter(
      (l) => l !== featureType && l !== "units"
    );

    // set our clickedType link to null
    // theMap.setFilter(layer.link, ["==", "$id", ""])

    // loop thru the others and get their linked
    others.forEach((o) => {
      let filter;
      if (
        linked[o].length === 1 &&
        (linked[o][0] === undefined || linked[o][0] === null)
      ) {
        filter = ["==", layers[o].filter_id, ""];
      } else {
        filter = ["in", layers[o].filter_id].concat(linked[o]);
      }
      style.layers.find((l) => l.id === layers[o].link).filter = filter;
    });
  }

  const map = useRef();
  const initialViewState = {
    bounds: [-83.287803, 42.255192, -82.910451, 42.45023],
    fitBoundsOptions: {
      padding: 50,
      maxZoom: 17,
    },
  };

  if (feature) {
    map.current.fitBounds(bbox(feature), {
      padding: 50,
      maxZoom: 17,
    });
  }

  const handleClick = (e) => {
    let clicked = map.current.queryRenderedFeatures(e.point, {
      layers: Object.keys(layers).map((l) => layers[l].interaction),
    })[0];

    if (clicked) {
      let layer = layers[clicked.sourceLayer];
      setSelectFeature({
        id: clicked.properties[layer.filter_id] || clicked.id,
        type: clicked.sourceLayer,
      });
    }
  };

  const handleDblClick = (e) => {
    return;
  };

  const handleGeocode = (address) => {

    // check address to see if it matches Detroit parcel regex
    let parcelRegex = /^([0,1,2][0-9])([0-9]{6,})([0-9L\.\-]{1,})$/;

    if (parcelRegex.test(address)) {
      console.log("It's a parcel!");

      queryFeatures({
        url: layers.parcels.feature_service,
        where: `parcel_number = '${address}'`,
        outFields: "*",
        f: "geojson",
      }).then((response) => {
        if (response.features.length > 0) {
          setSelectFeature({
            id: response.features[0].properties.parcel_number,
            type: "parcels",
          });
        }
        if (response.features.length === 0) {
          setSelectFeature({
            id: null,
            type: null,
          });
        }
      })
    }

    // otherwise, geocode the input as an address
    else {
      geocode({
        address: address,
        outFields: "*",
        endpoint: geocoders.prod,
      }).then((response) => {
        if (response.candidates.length > 0) {
          if (response.candidates[0].attributes.address_id !== 0) {
            setSelectFeature({
              id: response.candidates[0].attributes.address_id,
              type: "addresses",
            });
          }
          map.current.easeTo({
            center: [
              response.candidates[0].location.x,
              response.candidates[0].location.y,
            ],
            zoom: 17,
          });
        }
        if (response.candidates.length === 0) {
          setSelectFeature({
            id: null,
            type: null,
          });
        }
      });
    }
  };

  let [search, setSearch] = useState("");

  return (
    <>
      <div className="flex items-center gap-2">
        <input
          className="p-2 text-gray-800 bg-gray-100 my-2 w-1/2"
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleGeocode(search);
            }
          }}
        />
        <button onClick={() => handleGeocode(search)}>Search</button>
      </div>
      <Mapbox
        ref={map}
        mapLib={maplibregl}
        mapStyle={style}
        onDblClick={handleDblClick}
        onClick={handleClick}
        doubleClickZoom={false}
        initialViewState={initialViewState}
        interactiveLayerIds={Object.keys(layers).map(
          (l) => layers[l].interaction
        )}
      ></Mapbox>
    </>
  );
};

export default BaseUnitsMap;
