import { Box } from "@radix-ui/themes";
import { centroid } from "@turf/centroid";
import maplibregl from "maplibre-gl";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import layers from "../data/layers";
import { baseStyle, darkStyle, linenStyle, satelliteStyle } from "../styles/mapstyle";

const MapComponent = ({
  layer,
  setLayer,
  style,
  feature,
  linkedAddresses,
  refetch,
  streetview,
  viewerImage,
  viewerBearing,
  setSvImages,
}) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const { isDarkMode } = useTheme();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [clickedFeatures, setClickedFeatures] = useState([]);

  let mapStyles = {
    streets: baseStyle,
    satellite: satelliteStyle(),
    linen: linenStyle()
  }

  useEffect(() => {
    if (!mapLoaded) {
      loadMap();
    }
  }, [mapLoaded]);

  // useEffect(() => {
  //   if (mapInstance.current) {
  //     updateMapTheme();
  //   }
  // }, [isDarkMode]);

  // fires when dark mode changes
  const updateMapTheme = () => {
    if (mapInstance.current) {
      const style = isDarkMode ? darkStyle() : baseStyle;
      mapInstance.current.setStyle(style);
    }
  };

  const loadMap = () => {
    if (mapRef.current && !mapInstance.current) {
      const map = new maplibregl.Map({
        container: mapRef.current,
        style: style ? mapStyles[style] : baseStyle,
        center: [-83.07715, 42.37927],
        zoom: 10.75,
      });

      map.on("load", () => {
        setMapLoaded(true);

      });
 
      map.on("click", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: Object.keys(layers).map((lyr) => layers[lyr].interaction),
        });

        setClickedFeatures(features);
      });

      map.on("moveend", () => {
        if (mapInstance.current.getZoom() > 16.5) {
          let features = map.queryRenderedFeatures({
            layers: ["mapillary-images"],
          });
          setSvImages(features);
        } else {
          setSvImages([]);
        }
      });

      mapInstance.current = map;
    }
  };

  /**
   * When streetview is toggled, zoom to 17.51
   */
  useEffect(() => {
    if (mapInstance.current && streetview) {
      setTimeout(() => {
        if (mapInstance.current.getZoom() < 17.5) {
          mapInstance.current.easeTo({
            zoom: 17.51,
          });
        }
      }, 100);
    }
    if (mapInstance.current && !streetview) {
      setSvImages([]);
    }
  }, [streetview]);

  useEffect(() => {
    if (mapInstance.current && style && mapLoaded) {
      mapInstance.current.setStyle(mapStyles[style]);
    }
  }, [style]);

  /**
   * Effect for when the user clicks on the map
   */
  useEffect(() => {
    if (mapInstance.current && layer && mapLoaded) {
      const currentLyr = layers[layer];

      // reset all highlight filters
      Object.keys(layers).forEach((lyr) => {
        let layer = layers[lyr];
        if (!layer.highlight) return;
        mapInstance.current.setFilter(layer.highlight, ["==", "$id", ""]);
      });

      // check for clicked features
      if (clickedFeatures.length > 0) {

        let newFeature = clickedFeatures[0];

        const lyr = Object.keys(layers).find(
          (l) => layers[l].interaction === newFeature?.layer?.id
        );

        refetch(
          lyr === "parcel" ? newFeature?.properties.parcel_id : newFeature?.id,
          lyr
        );
        setLayer(lyr);

        // get the layer that was clicked
        let filter = ["==", "$id", newFeature?.id];
        if (lyr) {
          mapInstance.current.setFilter(layers[lyr]?.highlight, filter);
        }
      }
    }
  }, [clickedFeatures]);

  // useEffect(() => {
  //   if (mapInstance.current && layer && mapLoaded) {
  //     const currentLyr = layers[layer];

  //     // reset all highlight filters
  //     Object.keys(layers).forEach((lyr) => {
  //       let layer = layers[lyr];
  //       if (!layer.highlight) return;
  //       mapInstance.current.setFilter(layer.highlight, ["==", "$id", ""]);
  //     });

  //     // check for clicked features
  //     if (feature) {
  //       // set that as the clickedFeature
  //       let filter = [
  //         "==",
  //         layer === "parcel" ? "parcel_id" : currentLyr.id_column,
  //         feature.properties[currentLyr.id_column],
  //       ];
  //       mapInstance.current.setFilter(currentLyr.highlight, filter);
  //     }
  //   }
  // }, [layer]);

  // fly to centroid of selectedFeature (returned from the API)
  useEffect(() => {
    if (mapInstance.current && feature && feature.properties) {
      const currentLyr = layers[layer];

      Object.keys(layers).forEach((lyr) => {
        let layer = layers[lyr];
        if (!layer.highlight) return;
        mapInstance.current.setFilter(layer.highlight, ["==", "$id", ""]);
      });

      // set that as the clickedFeature
      let filter = [
        "==",
        layer === "parcel" ? "parcel_id" : "$id",
        feature.properties[currentLyr.id_column],
      ];
      mapInstance.current.setFilter(currentLyr.highlight, filter);

      const center = centroid(feature).geometry.coordinates;
      let zoom = mapInstance.current.getZoom();
      if (streetview && zoom < 17.5) {
        zoom = 17.51;
      };
      if (!streetview && zoom < 17.5) {
        zoom = 16.5;
      };
      mapInstance.current.easeTo({
        center,
        essential: true,
        zoom: zoom,
      });
    }
  }, [feature]);

  useEffect(() => {
    if (mapInstance.current && linkedAddresses.length > 0 && mapLoaded && layers[layer]) {
      // get the layers that aren't the current one
      const otherLayers = Object.keys(layers).filter((l) => l !== layer);

      if (layers[layer].linked) {
        mapInstance.current.setFilter(layers[layer]?.linked, ["==", "$id", ""]);
      }


      otherLayers.forEach((l) => {
        let lyr = layers[l];
        if (!lyr.link) return;

        let ids = linkedAddresses.map((a) => a.properties[lyr.id_column]);

        ids = ids.filter((id) => id !== null);

        let filter = ["in", l === "parcel" ? "parcel_id" : "$id"].concat(
          Array.from(new Set(ids))
        );

        mapInstance.current.setFilter(lyr.link, filter);
      });
    }

    if (mapInstance.current && layer === "address" && mapLoaded) {

      // get the layers that aren't the current one
      const otherLayers = Object.keys(layers).filter((l) => l !== layer);

      mapInstance.current.setFilter(layers[layer].link, ["==", "$id", ""]);

      otherLayers.forEach((l) => {
        let lyr = layers[l];
        if (!lyr.link) return;

        let filter = [
          "==",
          l === "parcel" ? "parcel_id" : "$id",
          feature.properties[lyr.id_column],
        ];

        mapInstance.current.setFilter(lyr.link, filter);
      });
    }

    if (
      mapInstance.current &&
      linkedAddresses.length === 0 &&
      layer !== "address" &&
      mapLoaded
    ) {
      Object.keys(layers).forEach((l) => {
        let lyr = layers[l];
        if (!lyr.link) return;
        mapInstance.current.setFilter(lyr.link, ["==", "$id", ""]);
      });
    }
  }, [linkedAddresses]);

  useEffect(() => {
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstance.current && mapLoaded) {
      mapInstance.current.resize();
    }
  }, [mapLoaded]);

  useEffect(() => {
    if (mapInstance.current && viewerImage) {
      let mlyLayer = "mapillary-location";
      mapInstance.current.setFilter(mlyLayer, [
        "==",
        "id",
        parseInt(viewerImage.image.id),
      ]);
    }
  }, [viewerImage]);

  useEffect(() => {
    if (mapInstance.current && viewerBearing) {
      let mlyLayer = "mapillary-location";
      mapInstance.current.setLayoutProperty(
        mlyLayer,
        "icon-rotate",
        viewerBearing - 90
      );
    }
  }, [viewerBearing]);

    
  return (
    <Box p="2">
      <Box
        ref={mapRef}
        height={
          !streetview
            ? { initial: "300px", sm: "500px", lg: "705px", xl: "900px" }
            : { initial: "250px", sm: "350px", lg: "375px", xl: "500px" }
        }
        p={"2"}
      ></Box>
    </Box>
  );
};

export default MapComponent;
