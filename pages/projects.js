import { queryFeatures } from "@esri/arcgis-rest-feature-layer";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import CurrentProject from "../src/Projects/CurrentProject";
import ProjectMap from "../src/Projects/ProjectMap";
import AppHeader from "../src/components/AppHeader";
import apps from "../src/data/apps";
import layers from "../src/data/layers";
import SiteSidebar from "../src/layout/SiteSidebar";
import NewProject from "../src/Projects/NewProject";
import SelectedParcels from "../src/Projects/SelectedParcels";

const Projects = ({ session }) => {
  let introduction = (
    <>
      Use this tool to edit existing development projects or add a new project.
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

  let projectLayers = {
    development: {
      layer_name: "Development projects",
      url: `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/DevLayer_rough_cut/FeatureServer/0`,
      id: "project_id",
      name: "name",
      fields: {
        name: "Project Name",
        id: "Unique ID",
        hrd_id: "HRD ID",
      },
    },
    arpa: {
      layer_name: "ARPA Projects",
      url: `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/arpa_project_shapes/FeatureServer/0`,
      id: "project_id",
      name: "project_name",
      fields: {
        project_name: "Project Name",
        project_id: "ARPA Project ID",
        description: "Description",
      },
    },
    major_areas : {
      layer_name: "Major development areas",
      url: `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/major_development_areas/FeatureServer/0`,
      id: "project_id",
      name: "area_name",
      fields: {
        area_name: "Area Name",
        area_type: "Area Type",
        project_id: "Project ID",
      }
    }
  };

  // store the currently edited layer here
  let [currentLayer, setCurrentLayer] = useState(projectLayers.development);

  // We'll store the list of currently selected parcels in here.
  let [parcels, setParcels] = useState([]);
  let [parcelData, setParcelData] = useState([]);

  // We'll store the list of currently selected projects in here.
  let [projects, setProjects] = useState([]);
  let [currentProject, setCurrentProject] = useState(null);

  let [addNew, setAddNew] = useState(false);

  let [updateDevs, setUpdateDevs] = useState(0);

  useEffect(() => {
    if (parcels.length === 0) {
      setParcelData([]);
      return;
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
    if (session) {
      queryFeatures({
        url: currentLayer.url,
        where: `1=1`,
        outFields: ["*"],
        f: "geojson",
        authentication: session,
      }).then((response) => {
        setProjects(response.features);
      });
    } else {
      return;
    }
  }, [session, updateDevs, currentLayer]);

  return (
    <>
      <AppHeader app={apps.projects} introduction={introduction} introOpen={false}>
        <p className="text-sm text-gray-500 mb-1">Select a layer to edit:</p>
        <Select
          options={Object.keys(projectLayers).map((layer) => {
            return {
              value: projectLayers[layer].url,
              label: projectLayers[layer].layer_name,
            };
          })}
          defaultValue={currentLayer.url}
          onChange={(e) => {
            setCurrentLayer(
              projectLayers[
                Object.keys(projectLayers).find(
                  (key) => projectLayers[key].url === e.value
                )
              ]
            );
          }}
        />
        <p className="text-sm text-gray-500 my-1">
          Search projects:
        </p>

        <Select
          options={projects.map((ft) => {
            return {
              value: ft.properties.GlobalID,
              label: ft.properties[currentLayer.name],
            };
          })}
          defaultValue={null}
          onChange={(e) =>
            setCurrentProject(
              projects.find((d) => d.properties.GlobalID === e.value)
            )
          }
        />
      </AppHeader>
      <SiteSidebar title="Projects" className="gap-2 flex">
        {currentProject && (
          <CurrentProject
            project={currentProject}
            setCurrentProject={setCurrentProject}
            parcelData={parcelData}
            setParcels={setParcels}
            setParcelData={setParcelData}
            session={session}
            updateDevs={updateDevs}
            setUpdateDevs={setUpdateDevs}
            currentLayer={currentLayer}
          />
        )}
        {parcels.length > 0 && (
          <SelectedParcels
            parcels={parcels}
            parcelData={parcelData}
            setParcels={setParcels}
            addNew={addNew}
            setAddNew={setAddNew}
            project={currentProject}
          />
        )}
        {addNew && (
          <NewProject
            parcelData={parcelData}
            setParcels={setParcels}
            setParcelData={setParcelData}
            session={session}
            updateDevs={updateDevs}
            setUpdateDevs={setUpdateDevs}
            setAddNew={setAddNew}
            currentLayer={currentLayer}
          />
        )}
      </SiteSidebar>
      <main>
        <ProjectMap
          projects={projects}
          currentProject={currentProject}
          setCurrentProject={setCurrentProject}
          parcels={parcels}
          setParcels={setParcels}
        />
      </main>
    </>
  );
};

export default Projects;
