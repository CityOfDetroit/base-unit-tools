import { geojsonToArcGIS } from "@esri/arcgis-to-geojson-utils";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { featureCollection, combine } from "@turf/turf";
import React, { useEffect, useState } from "react";
import { updateFeatures } from "@esri/arcgis-rest-feature-layer";
import ProjectEvents from "./ProjectEvents";

const CurrentProject = ({
  project,
  setCurrentProject,
  parcelData,
  setParcelData,
  setParcels,
  updateDevs,
  setUpdateDevs,
  session,
  currentLayer
}) => {

  useEffect(() => {
    setParcels([]);
    setParcelData([]);
    let newProperties = {}
  
    Object.keys(currentLayer.fields).forEach((key) => {
      newProperties[key] = project.properties[key]
    })
    setNewProps(newProperties);
  }, [project]);

  let newProperties = {}
  
  Object.keys(currentLayer.fields).forEach((key) => {
    newProperties[key] = project.properties[key]
  })

  let [newProps, setNewProps] = useState(newProperties);

  const updateFeature = (feature, properties, parcelData = null) => {
    let updatedFeature = _.cloneDeep(feature);

    let newProperties = {
      GlobalID: updatedFeature.properties.GlobalID,
      OBJECTID: updatedFeature.properties.OBJECTID,
      ...properties
    };

    updatedFeature.properties = newProperties;

    if (parcelData) {
      let combined = combine(featureCollection(parcelData));
      updatedFeature.geometry = combined.features[0].geometry;
    }

    let esriFeature = geojsonToArcGIS(updatedFeature);

    updateFeatures({
      url: currentLayer.url,
      features: [esriFeature],
      authentication: session,
    }).then((response) => {
      if (response.updateResults[0].success) {
        setParcels([]);
        setUpdateDevs(updateDevs + 1);
      }
    });
  };

  return (
    <div className="mt-2">
      <div className="bg-purple-200 text-gray-700 font-bold px-2 py-1 text-sm flex items-center justify-between">
        <span>Selected project</span>
        <FontAwesomeIcon
          icon={faWindowClose}
          onClick={() => setCurrentProject(null)}
        />
      </div>
      <section className=" bg-slate-500 sidebar-section flex gap-2 flex-col">

        {Object.keys(currentLayer.fields).map((key) => {
          return (
            <div>
              <p className="font-bold">{currentLayer.fields[key]}</p>
              <input
                type="text"
                className="p-2 w-full"
                value={newProps[key] === "" ? project.properties[key] : newProps[key]}
                onChange={(e) => {
                  setNewProps({...newProps, [key]: e.target.value})
                }}
              />
            </div>
          );
        })}

        <button
          className="mt-8"
          onClick={() =>
            updateFeature(project, newProps, null)
          }
        >
          Update project attributes
        </button>

        {parcelData.length > 0 && (
          <button
            className="mt-2"
            onClick={() =>
              updateFeature(project, newProps, parcelData)
            }
          >
            Update project with selected parcels
          </button>
        )}
      </section>
      <ProjectEvents project={project} session={session}/>
    </div>
  );
};

export default CurrentProject;
