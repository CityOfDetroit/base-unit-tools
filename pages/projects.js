import React, { useEffect, useRef, useState } from "react";
import AppHeader from "../src/components/AppHeader";
import apps from "../src/data/apps";
import SiteSidebar from "../src/layout/SiteSidebar";
import MapboxGL from "mapbox-gl/dist/mapbox-gl";
import Mapbox, { NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { queryFeatures } from "@esri/arcgis-rest-feature-layer";
import layers from "../src/data/layers";
import Select from "react-select";
import ProjectMap from "../src/Projects/ProjectMap";
import CurrentProject from "../src/Projects/CurrentProject";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";
import SelectedParcel from "../src/Projects/SelectedParcel";

const Projects = ({ session, setSession, login, setLogin }) => {
  let introduction = (
    <>
        Use this tool to edit existing development projects or add a new
        project.

        <ul className="text-sm list-disc list-inside flex gap-2 flex-col mt-2">
          <li>
        <b>Single-click</b> to select a development project. 

          </li>
          <li>
        <b>Double-click</b> to select parcels on the map.

          </li>
        </ul>

        
    </>
  );

  // We'll store the list of currently selected parcels in here.
  let [parcels, setParcels] = useState([]);
  let [parcelData, setParcelData] = useState([]);

  let [developments, setDevelopments] = useState([]);
  let [currentDevelopment, setCurrentDevelopment] = useState(null);

  let [updateDevs, setUpdateDevs] = useState(0);

  useEffect(() => {
    if (parcels.length === 0) {
      setParcelData([]);
    }
    queryFeatures({
      url: layers.parcels.feature_service,
      where: `parcel_number in (${parcels.map((p) => `'${p}'`).join(",")})`,
      outFields: ["*"],
      f: "geojson",
    }).then((response) => {
      setParcelData(response.features);
    });
  }, [parcels]);

  useEffect(() => {
    if(session) {
      queryFeatures({
        url: `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/DevLayer_rough_cut/FeatureServer/0`,
        where: `1=1`,
        outFields: ["*"],
        f: "geojson",
        authentication: session,
      }).then((response) => {
        setDevelopments(response.features);
      });
    }
    else {
      return;
    }
  }, [session, updateDevs]);

  return (
    <>
      <AppHeader app={apps.projects} introduction={introduction}>
        <p className="text-sm text-gray-500 mb-1">
          Search for development projects:
        </p>

        <Select
          options={developments.map((ft) => {
            return {
              value: ft.properties.id,
              label: ft.properties["name"],
            };
          })}
          defaultValue={null}
          onChange={(e) =>
            setCurrentDevelopment(
              developments.find((d) => d.properties.id === e.value)
            )
          }
        />
      </AppHeader>
      <SiteSidebar title="Development projects" className="gap-2 flex">
        {currentDevelopment && (
          <CurrentProject
            development={currentDevelopment}
            setCurrentDevelopment={setCurrentDevelopment}
            parcelData={parcelData}
            setParcels={setParcels}
            setParcelData={setParcelData}
            session={session}
            updateDevs={updateDevs}
            setUpdateDevs={setUpdateDevs}
          />
        )}
        {parcels.length > 0 && (
          <div className="mt-4">
          <div className=" text-gray-700 font-bold px-2 py-1 text-sm flex items-center justify-between bg-green-200">
            <span>Selected parcels</span>
            <FontAwesomeIcon icon={faWindowClose} onClick={() => setParcels([])} />
          </div>
            <section className="sidebar-section">
              <h3>{parcels.length} parcels selected</h3>
              {parcels.map((parcel) => (
                <SelectedParcel
                  parcel={parcel}
                  parcelData={parcelData.find(
                    (p) => p.properties.parcel_number === parcel
                  )}
                  key={parcel}
                />
              ))}
              <button onClick={() => setParcels([])}>Clear</button>
            </section>
          </div>
        )}
      </SiteSidebar>
      <main>
        <ProjectMap
          developments={developments}
          currentDevelopment={currentDevelopment}
          setCurrentDevelopment={setCurrentDevelopment}
          parcels={parcels}
          setParcels={setParcels}
        />
      </main>
    </>
  );
};

export default Projects;
