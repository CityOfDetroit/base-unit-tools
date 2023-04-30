import { addFeatures, updateFeatures } from "@esri/arcgis-rest-feature-layer";
import { geojsonToArcGIS } from "@esri/arcgis-to-geojson-utils";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { combine, featureCollection } from "@turf/turf";
import React, { useState } from "react";

const NewProject = ({
  development,
  parcelData,
  setParcels,
  updateDevs,
  setUpdateDevs,
  session,
  setAddNew,
  currentLayer,
}) => {
  let newProperties = {};

  Object.keys(currentLayer.fields).forEach((key) => {
    newProperties[key] = '';
  });

  let [newProps, setNewProps] = useState(newProperties);

  const addFeature = (properties, parcelData = null) => {
    let newFeature = {
      type: "Feature",
      properties: properties,
      geometry: {},
    };

    if (parcelData) {
      let combined = combine(featureCollection(parcelData));
      newFeature.geometry = combined.features[0].geometry;
    }

    let esriFeature = geojsonToArcGIS(newFeature);


    addFeatures({
      url: currentLayer.url,
      features: [esriFeature],
      authentication: session,
    }).then((response) => {
      if (response.addResults[0].success) {
        setParcels([]);
        setUpdateDevs(updateDevs + 1);
        setAddNew(false);
      }
    });
  };

  return (
    <div className="mt-4">
      <div className=" text-gray-700 font-bold px-2 py-1 text-sm flex items-center justify-between bg-red-200">
        <span>New project</span>
        <FontAwesomeIcon
          icon={faWindowClose}
          onClick={() => setAddNew(false)}
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
                value={newProps[key]}
                onChange={(e) => {
                  setNewProps({ ...newProps, [key]: e.target.value });
                }}
              />
            </div>
          );
        })}

        <button
          className="mt-2"
          onClick={() => addFeature(newProps, parcelData)}
        >
          Create new project
        </button>
      </section>
    </div>
  );
};

export default NewProject;
