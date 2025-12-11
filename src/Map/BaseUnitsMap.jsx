import { Card, Flex, Grid, Select, Text } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import layers from "../data/layers";
import useBaseFeature from "../hooks/useBaseFeature";
import useGeocoder from "../hooks/useGeocoder";
import AddressLinks from "./AddressLinks";
import FeatureTable from "./FeatureTable";
import LayerSwitcher from "./LayerSwitcher";
import LinkedAddresses from "./LinkedAddresses";
import LinkedBuildings from "./LinkedBuildings";
import MapComponent from "./Map";
import MapGeocoder from "./MapGeocoder";
import Mapillary from "./Mapillary";
import MapillarySwitch from "./MapillarySwitch";
import BuildingLinks from "./BuildingLinks";
import BasemapSelector from "./BasemapSelector";
import ModeSelector from "./ModeSelector";

const BaseUnitsMap = () => {
  const [params, setParams] = useSearchParams();

  // main pieces of state
  // the currently selected layer
  const [layer, setLayer] = useState(
    params?.get("layer") || params?.get("type") || "parcel"
  );

  // streetview state
  let [streetview, setStreetview] = useState(false);
  let [svImages, setSvImages] = useState([]);
  let [viewerImage, setViewerImage] = useState(null);
  let [viewerBearing, setViewerBearing] = useState(0);

  // map state
  let [style, setStyle] = useState("streets");

  // selection mode state (all, parcel, building, street)
  const [mode, setMode] = useState(params?.get("mode") || "all");

  // the primary hook for fetching the current feature
  const {
    data: feature,
    loading,
    error,
    refetch,
    nullify,
  } = useBaseFeature(params?.get("id"), layer);

  const {
    feature: geocodedFeature,
    loading: geocodeLoading,
    error: geocodeError,
    changeAddress: geocodeRefetch,
  } = useGeocoder();

  // linked addresses for the feature
  const [linkedAddresses, setLinkedAddresses] = useState([]);

  // refetch when params change
  useEffect(() => {
    setLinkedAddresses([]);
    if (params?.get("layer")) {
      refetch(params?.get("id"), params?.get("layer"));
      setLayer(params?.get("layer"));
    }
  }, [params]);

  // update the feature when the geocoded feature changes
  useEffect(() => {
    if (geocodedFeature) {
      setStreetview(false);
      setParams({
        id:
          layer === "parcel"
            ? geocodedFeature.attributes["parcel_id"]
            : geocodedFeature.attributes[layers[layer].id_column],
        layer: layer,
      });
    }
  }, [geocodedFeature]);

  // reset linkedAddresses & params when the feature changes
  useEffect(() => {
    setLinkedAddresses([]);
    if (feature) {
      setParams({
        id: feature?.properties
          ? feature.properties[layers[layer].id_column]
          : null,
        layer: layer,
      });
    }
  }, [feature]);

  // reset linked addresses when the layer changes
  useEffect(() => {
    setLinkedAddresses([]);
  }, [layer]);

  // sync mode to URL
  useEffect(() => {
    const currentMode = params?.get("mode");
    if (mode === "all" && currentMode) {
      const newParams = new URLSearchParams(params);
      newParams.delete("mode");
      setParams(newParams);
    } else if (mode !== "all" && currentMode !== mode) {
      const newParams = new URLSearchParams(params);
      newParams.set("mode", mode);
      setParams(newParams);
    }
  }, [mode]);

  return (
    <Grid
      areas={{
        initial: "'streetview' 'geocoder' 'map' 'info'",
        md: "'info geocoder' 'info streetview' 'info map' 'info map'",
      }}
      columns={{ initial: "1fr", md: "1fr 2fr", lg: "1fr 2fr" }}
      rows={{ initial: "auto auto auto auto", md: "min-content 0fr 1fr 1fr" }}
      gap={{ initial: "0", md: "0" }}
      p={{ initial: "0", md: "2", lg: "4" }}
    >

      {/* geocoding panel */}
      <Flex
        gap={"2"}
        gridArea={"geocoder"}
        justify={"start"}
        align={"center"}
        p={"2"}
        direction={"row"}
      >
        <Card size={"1"} className="">
          {/* mapillary bit */}
          <MapillarySwitch {...{ streetview, setStreetview }} />
        </Card>
        <Card>
          <BasemapSelector {...{ style, setStyle }} />
        </Card>
        <Card>
          <ModeSelector {...{ mode, setMode }} />
        </Card>
      </Flex>

      {/* feature information */}
      <Flex
        gap={"2"}
        gridArea={"info"}
        justify={"start"}
        p="2"
        direction="column"
        className=""
        overflowX={"auto"}
      >
        <Card size={"1"} className="">
          <MapGeocoder {...{ geocodeRefetch, geocodeError, refetch }} />
        </Card>
        <FeatureTable
          {...{
            feature,
            loading,
            layer,
            refetch,
          }}
        />
        {feature && layer === "parcel" && (
          <LinkedBuildings
            {...{
              feature,
              layer,
              refetch,
            }}
          />
        )}
        {feature && layer === "address" && (
          <AddressLinks
            {...{
              feature,
              layer,
              refetch,
            }}
          />
        )}
        {feature && layer === "building" && (
          <BuildingLinks
            {...{
              layer,
              feature,
              loading,
              refetch,
              linkedAddresses,
              setLinkedAddresses,
            }}
          />
        )}
        {feature && (
          <LinkedAddresses
            {...{
              layer,
              feature,
              loading,
              refetch,
              linkedAddresses,
              setLinkedAddresses,
            }}
          />
        )}
      </Flex>

      {streetview ? (
        <Mapillary
          {...{
            svImages,
            feature,
            viewerImage,
            setViewerImage,
            setViewerBearing,
          }}
        />
      ) : (
        <div style={{ gridArea: "streetview", height: "0 auto" }}></div>
      )}

      {/* map component */}
      <div style={{ gridArea: "map" }}>
        <MapComponent
          {...{
            layer,
            setLayer,
            style,
            feature,
            linkedAddresses,
            refetch,
            streetview,
            svImages,
            setSvImages,
            viewerImage,
            viewerBearing,
            geocodedFeature,
            mode
          }}
        />
      </div>
    </Grid>
  );
};

export default BaseUnitsMap;
