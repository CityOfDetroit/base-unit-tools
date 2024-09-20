import { queryFeatures } from "@esri/arcgis-rest-feature-layer";
import { geocode } from "@esri/arcgis-rest-geocoding";
import bbox from "@turf/bbox";
import _ from "lodash";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { useEffect, useRef, useState } from "react";
import Mapbox from "react-map-gl";
import layers from "../data/layers";
import { geocoders } from "../hooks/useGeocoder";
import { baseStyle, satelliteStyle, linenStyle } from "../styles/mapstyle";
import videoIcon from "../images/video.png";

const BaseUnitsMap = ({
  feature,
  selectFeature,
  setSelectFeature,
  linked,
  visible,
  setVisible,
  basemap,
  setSvImages,
  svImage,
  svBearing,
  streetView,
}) => {
  let featureId = selectFeature.id;
  let featureType = selectFeature.type;

  // set the style based on the basemap
  let styles = {
    streets: baseStyle,
    satellite: satelliteStyle(),
    linen: linenStyle(),
  };

  let style = _.cloneDeep(styles[basemap]);

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


  if (Object.values(visible).every((v) => v === false) === false) {
    // set the visibility of the layers
    Object.keys(visible).forEach((key) => {
      style.layers.forEach((l) => {
        if (l["source-layer"] === key) {
          l.layout.visibility = visible[key] ? "visible" : "none";
        }
      });
    });
  }

  // set svBearing
  if (svImage) {
    let layer = style.layers.find((l) => l.id === "mapillary-location");
    layer.layout.visibility = streetView ? "visible" : "none";
    layer.layout['icon-rotate'] = svBearing - 90;
    layer.filter = ["==", "id", parseInt(svImage.properties.id)];
  }

  const map = useRef();
  const initialViewState = {
    bounds: [-83.287803, 42.255192, -82.910451, 42.45023],
    fitBoundsOptions: {
      padding: 50,
      maxZoom: 17,
    },
  };

  // useEffect(() => {
  //   if (map.current) {
  //     map.current.loadImage(videoIcon, (error, image) => {
  //       if (error) throw error;
  //       map.current.addImage("video", image);
  //     });
  //   }
  // }, [map.current]);

  useEffect(() => {
    if (feature && map.current) {
      map.current.fitBounds(bbox(feature), {
        padding: 50,
        maxZoom: 17.51,
      });
    }
  }, [feature]);

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

      setVisible({
        ...visible,
        parcels: true
      })

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
      });

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
            // if there's just one key true in "visible", put that in a variable
            let visibleLayers = Object.keys(visible).filter(
              (key) => visible[key] === true
            );
            if (visibleLayers.length === 1) {
              let layer = layers[visibleLayers[0]];
              setSelectFeature({
                id: response.candidates[0].attributes[
                  visibleLayers[0] === "parcels" ? "parcel_id" : layer.id_column
                ],
                type: visibleLayers[0],
              });
            } else {
              setSelectFeature({
                id: response.candidates[0].attributes.parcel_id,
                type: "parcels",
              });
            }
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

  const handleMoveEnd = (e) => {
    if (map.current.getZoom() > 17.5) {
      let features = map.current.queryRenderedFeatures({
        layers: ["mapillary-images"],
      });
      let uniqs = _.uniqBy(features, "properties.id");
      setSvImages(uniqs);
    }
  };

  let [search, setSearch] = useState("");

  return (
    <>
      <div className="flex items-center gap-2">
        <input
          className="p-2 text-gray-800 bg-gray-100 my-2 w-1/2"
          type="text"
          placeholder="Search by address (2 Woodward) / parcel ID (02002661.)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleGeocode(search);
            }
          }}
        />
        <button onClick={() => handleGeocode(search)}
        className="button">Search</button>
      </div>
      <Mapbox
        ref={map}
        mapLib={maplibregl}
        mapStyle={style}
        onDblClick={handleDblClick}
        onClick={handleClick}
        onMoveEnd={handleMoveEnd}
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
