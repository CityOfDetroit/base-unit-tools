import { faArrowAltCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import BaseUnitsMap from "../src/Map/BaseUnitsMap";
import AppHeader from "../src/components/AppHeader";
import apps from "../src/data/apps";
import useFeature from "../src/hooks/useFeature";
import SiteSidebar from "../src/layout/SiteSidebar";
import ExplorerFeature from "../src/Explorer/ExplorerFeature";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import MapillarySv from "../src/components/MapillarySv";

const Explorer = ({ session, setSession, login, setLogin, currentApp }) => {
  let introduction = (
    <>
      <p>
        This tool is for exploring the base units and visualizing the
        relationships between them.
      </p>
      <p>You can start by:</p>
      <ul className="list-disc list-outside ml-4 pb-2">
        <li>Searching for an address</li>
        <li>Clicking a feature on the map</li>
      </ul>
      <p>
        Once an address, building, parcel, or street is selected, you'll be able
        to see the other base units it is linked to.
      </p>
      <p>
        Click the{" "}
        <FontAwesomeIcon icon={faArrowAltCircleRight} className="mx-1 tex" />{" "}
        next to a linked base unit's ID to navigate to that linked unit.
      </p>
      <p>
        You can also see a street view image of the currently selected feature,
        or turn on satellite imagery on the map.
      </p>
    </>
  );

  let router = useRouter();

  // this is the key piece of state: what feature is currently selected?
  let [selectFeature, setSelectFeature] = useState({
    id: router.query.id,
    type: router.query.type,
  });

  // this is the feature that is selected on the map
  // it is fetched from the API using the selectFeature state
  let feature = useFeature({ ...selectFeature, f: "geojson" });

  // this stores IDs of linked features, to be highlighted on the map.
  let [linked, setLinked] = useState({
    addresses: [],
    parcels: [],
    buildings: [],
    streets: [],
  });

  // store current basemap style
  let [basemap, setBasemap] = useState("streets");

  // store street view images
  let [svImages, setSvImages] = useState([]);
  let [svImage, setSvImage] = useState(null);
  let [svBearing, setSvBearing] = useState(0);
  let [streetView, setStreetView] = useState(false);

  // when the query params change, update the selectFeature state
  useEffect(() => {
    setSelectFeature({
      id: router.query.id,
      type: router.query.type,
    });
  }, [router.query.id, router.query.type]);

  useEffect(() => {
    if (router.query.layer) {
      setVisible({
        addresses: router.query.layer === "addresses" ? false : false,
        parcels: router.query.layer === "parcels" ? true : false,
        buildings: router.query.layer === "buildings" ? true : false,
        streets: router.query.layer === "streets" ? true : false,
      });
    }
  }, [router.query.layer]);

  // when the selectFeature state changes, update the query params
  useEffect(() => {
    if (selectFeature.id && selectFeature.type) {
      router.replace(
        `/map?id=${selectFeature.id}&type=${selectFeature.type}`,
        undefined,
        { shallow: true }
      );
    }
  }, [feature]);

  useEffect(() => {
    // console.log(svImages);
  }, [svImages]);

  // this stores which layers are visible on the map
  let [visible, setVisible] = useState({
    addresses:
      (router.query.layer === "addresses" || !router.query.layer) ? false : false,
    parcels:
      (router.query.layer === "parcels" || !router.query.layer) ? true : false,
    buildings:
      (router.query.layer === "buildings" || !router.query.layer) ? true : false,
    streets:
      (router.query.layer === "streets" || !router.query.layer) ? true : false,
  });

  return (
    <>
      <AppHeader app={apps.map} introduction={introduction} introOpen={false}>
        <div className="flex flex-col h-full gap-4">
          {/* ToggleGroup for setBasemap */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 font-semibold w-2/5">
              Basemap
            </p>
            {router && (
              <ToggleGroup.Root
                type="single"
                className="inline-flex rounded"
                defaultValue={
                  router.query.basemap ? router.query.basemap : "streets"
                }
                onValueChange={(value) => {
                  setBasemap(value);
                  if (!value) {
                    setBasemap("streets");
                  }
                }}
              >
                {["streets", "satellite", "linen"].map((key) => (
                  <ToggleGroup.Item
                    key={key}
                    value={key}
                    data-state={basemap === key ? "on" : "off"}
                    className="text-xs first:rounded-l last:rounded-r toggle-group-item"
                  >
                    {key}
                  </ToggleGroup.Item>
                ))}
              </ToggleGroup.Root>
            )}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-500 font-semibold">
              Visible layers
            </p>
            {/* ToggleGroup for setVisible */}
            {router && (
              <ToggleGroup.Root
                type="multiple"
                className="grid grid-cols-2 gap-1"
                defaultValue={
                  router.query.layer
                    ? [router.query.layer]
                    : ["parcels", "buildings", "streets"]
                }
                onValueChange={(value) => {
                  console.log(value);
                  let newVisible = {
                    addresses: false,
                    parcels: false,
                    buildings: false,
                    streets: false,
                  };
                  value.forEach((v) => {
                    newVisible[v] = true;
                  });
                  setVisible(newVisible);
                }}
              >
                {Object.keys(visible).map((key) => (
                  <ToggleGroup.Item
                    key={key}
                    value={key}
                    data-state={visible[key] ? "on" : "off"}
                    className="text-xs toggle-group-item rounded"
                  >
                    {key}
                  </ToggleGroup.Item>
                ))}
              </ToggleGroup.Root>
            )}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-500 font-semibold">
              Street View
            </p>
            {/* ToggleGroup for setStreetView */}
            <ToggleGroup.Root
              type="single"
              className="inline-flex rounded"
              defaultValue={streetView ? "streetView" : "streetView"}
              onValueChange={(value) => {
                setStreetView(value === "streetView" ? true : false);
              }}
            >
              <ToggleGroup.Item
                value="streetView"
                data-state={streetView ? "on" : "off"}
                className="text-xs toggle-group-item rounded"
              >
                {streetView ? "On" : "Off"}
              </ToggleGroup.Item>
            </ToggleGroup.Root>
          </div>
        </div>
      </AppHeader>
      <SiteSidebar title="Explorer">
        {svImages.length > 0 && streetView && <MapillarySv {...{svImage, svImages, setSvImage, setSvBearing, feature}} />}
        {feature && (
          <ExplorerFeature {...{ feature, selectFeature, setLinked }} />
        )}
      </SiteSidebar>

      {/* the main panel contains the map, and we pass it many of our useState variables */}
      <main>
        <BaseUnitsMap
          {...{
            feature,
            selectFeature,
            setSelectFeature,
            linked,
            visible,
            basemap,
            setSvImages,
            svImage,
            svBearing,
            streetView
          }}
        />
      </main>
    </>
  );
};

export default Explorer;
