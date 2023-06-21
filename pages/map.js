import {
  faArrowAltCircleRight
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import BaseUnitsMap from "../src/Map/BaseUnitsMap";
import AppHeader from "../src/components/AppHeader";
import apps from "../src/data/apps";
import useFeature from "../src/hooks/useFeature";
import SiteSidebar from "../src/layout/SiteSidebar";
import ExplorerFeature from "../src/Explorer/ExplorerFeature";

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
  let [selectFeature, setSelectFeature] = useState({
    id: router.query.id,
    type: router.query.type
  })

  let feature = useFeature({...selectFeature, f: 'geojson'});

  // this stores IDs of linked features, to be highlighted on the map.
  let [linked, setLinked] = useState({
    addresses: [],
    parcels: [],
    buildings: [],
    streets: [],
  });
  
  useEffect(() => {
    setSelectFeature({
      id: router.query.id,
      type: router.query.type
    })
  }, [router.query])

  useEffect(() => {
    if(selectFeature.id && selectFeature.type) {
      router.replace(`/map?id=${selectFeature.id}&type=${selectFeature.type}`, undefined, {shallow: true});
    }
  }, [feature])
  

  return (
    <>
      <AppHeader
        app={apps.map}
        introduction={introduction}
        introOpen={false}
      ></AppHeader>
      <SiteSidebar title="Explorer">

        {feature && <ExplorerFeature {...{ feature, selectFeature, setLinked }} />}
        
      </SiteSidebar>

      {/* the main panel contains the map, and we pass it many of our useState variables */}
      <main>
        <BaseUnitsMap {...{feature, selectFeature, setSelectFeature, linked}}/>
      </main>
    </>
  );
};

export default Explorer;
