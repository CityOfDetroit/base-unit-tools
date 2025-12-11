import { Box } from "@radix-ui/themes";
import { centroid } from "@turf/centroid";
import maplibregl from "maplibre-gl";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import layers from "../data/layers";
import { baseStyle, darkStyle, linenStyle, satelliteStyle } from "../styles/mapstyle";
import { geocode } from "@esri/arcgis-rest-geocoding";
import { map } from "underscore";

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
  geocodedFeature,
  mode = "all"
}) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const modeRef = useRef(mode);
  const { isDarkMode } = useTheme();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [clickedFeatures, setClickedFeatures] = useState([]);

  // Keep mode ref in sync
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

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

      // Add navigation controls (zoom in/out)
      map.addControl(new maplibregl.NavigationControl(), "top-right");

      // Add geolocate control (find me)
      const geolocate = new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: false,
      });

      geolocate.on("geolocate", (e) => {
        const { latitude, longitude } = e.coords;

        // Detroit bounding box (with some buffer)
        const detroitBounds = {
          minLat: 42.25,
          maxLat: 42.50,
          minLng: -83.30,
          maxLng: -82.90,
        };

        // Check if user is within or near Detroit
        if (
          latitude >= detroitBounds.minLat &&
          latitude <= detroitBounds.maxLat &&
          longitude >= detroitBounds.minLng &&
          longitude <= detroitBounds.maxLng
        ) {
          map.flyTo({
            center: [longitude, latitude],
            zoom: 17.5,
          });
        }
        // If outside Detroit, don't move the map
      });

      map.addControl(geolocate, "top-right");
 
      map.on("click", (e) => {
        // Filter layers based on current mode
        const queryLayers = modeRef.current === "all"
          ? Object.keys(layers).map((lyr) => layers[lyr].interaction)
          : [layers[modeRef.current]?.interaction].filter(Boolean);

        const features = map.queryRenderedFeatures(e.point, {
          layers: queryLayers,
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

      // If in a specific mode and no features found, don't blank out current selection
      if (clickedFeatures.length === 0 && mode !== "all") {
        return;
      }

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

        const clickProp = layers[lyr]?.click;
        const clickId = clickProp ? newFeature?.properties[clickProp] : newFeature?.id;
        refetch(clickId, lyr);
        setLayer(lyr);

        // get the layer that was clicked
        const filterProp = layers[lyr]?.filter_id || "$id";
        let filter = ["==", filterProp, clickId];
        if (lyr) {
          mapInstance.current.setFilter(layers[lyr]?.highlight, filter);
        }
      }
    }
  }, [clickedFeatures]);

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
      const filterProp = currentLyr.filter_id || "$id";
      let filter = [
        "==",
        filterProp,
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

    if (mapInstance.current && !feature && geocodedFeature) {
      mapInstance.current.easeTo({
        center: [
          geocodedFeature?.location?.x,
          geocodedFeature?.location?.y,
        ],
        zoom: 17.51,
      });
    }
  }, [feature, geocodedFeature]);

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

        const filterProp = lyr.filter_id || "$id";
        let filter = ["in", filterProp].concat(
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

        const filterProp = lyr.filter_id || "$id";
        let filter = [
          "==",
          filterProp,
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

  // Show/hide the Mapillary camera location on the map
  useEffect(() => {
    if (mapInstance.current && mapLoaded) {
      const imageFilter = viewerImage && streetview
        ? ["==", "id", parseInt(viewerImage.image.id)]
        : ["==", "id", ""];

      mapInstance.current.setFilter("mapillary-location", imageFilter);
      mapInstance.current.setFilter("mapillary-direction", imageFilter);
    }
  }, [viewerImage, streetview, mapLoaded]);

  // Rotate the direction icon to match the viewer bearing
  useEffect(() => {
    if (mapInstance.current && mapLoaded && viewerBearing !== undefined && streetview) {
      mapInstance.current.setLayoutProperty(
        "mapillary-direction",
        "icon-rotate",
        viewerBearing - 90
      );
    }
  }, [viewerBearing, streetview]);

    
  return (
    <Box p="2">
      <Box
        ref={mapRef}
        height={
          !streetview
            ? { initial: "300px", md: "500px", lg: "705px", xl: "900px" }
            : { initial: "200px", md: "350px", lg: "400px", xl: "450px" }
        }
        p={"2"}
      ></Box>
    </Box>
  );
};

export default MapComponent;
