import {
  Card,
  Flex,
  Grid
} from "@radix-ui/themes";
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

const BaseUnitsMap = () => {

  const [params, setParams] = useSearchParams();

  // main pieces of state
  // the currently selected layer
  const [layer, setLayer] = useState(params?.get("layer") || params?.get("type") || "parcel");

  // streetview state
  let [streetview, setStreetview] = useState(false);
  let [svImages, setSvImages] = useState([]);
  let [viewerImage, setViewerImage] = useState(null);
  let [viewerBearing, setViewerBearing] = useState(0);

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

  return (
    <Grid
      areas={{
        initial: "'streetview' 'geocoder' 'map' 'info' 'controls'",
        sm: "'info streetview' 'info geocoder' 'info map' 'info controls'",
      }}
      columns={{ initial: "1fr", sm: "1fr 1fr", md: "2fr 3fr" }}
      rows={{ initial: "auto auto auto auto auto", sm: "auto auto auto" }}
      gap={{ initial: "0", sm: "2" }}
      p={{ initial: "0", sm: "2", lg: "4" }}
    >
      {/* app control panel */}
      {/* <LayerSwitcher {...{ layer, setLayer }} /> */}

      {/* geocoding panel */}
      <Flex
        gap={"4"}
        gridArea={"geocoder"}
        justify={"start"}
        align={"center"}
        pt={{ initial: "2", sm: "0" }}
        p={"2"}
        direction={{
          initial: "column",
          sm: "row",
        }}
      >
        <Card size={"1"} className="w-full sm:w-2/3">
          <MapGeocoder {...{ geocodeRefetch, geocodeError }} />
        </Card>

        <Card size={"1"} className="w-full sm:w-1/3">
          {/* mapillary bit */}
          <MapillarySwitch {...{ streetview, setStreetview }} />
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
        <div style={{ gridArea: "streetview", height: 0 }}></div>
      )}

      {/* map component */}
      <div style={{ gridArea: "map" }}>
        <MapComponent
          {...{
            layer,
            setLayer,
            feature,
            linkedAddresses,
            refetch,
            streetview,
            svImages,
            setSvImages,
            viewerImage,
            viewerBearing,
          }}
        />
      </div>
    </Grid>
  );
};

export default BaseUnitsMap;
