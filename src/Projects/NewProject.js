import { addFeatures, updateFeatures } from "@esri/arcgis-rest-feature-layer";
import { geojsonToArcGIS } from "@esri/arcgis-to-geojson-utils";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { combine, featureCollection } from "@turf/turf";
import React, { useState } from "react";


const NewProject = ({   development,
  parcelData,
  setParcels,
  updateDevs,
  setUpdateDevs,
  session,setAddNew}) => {

  let [name, setName] = useState("");
  let [uniqueId, setUniqueId] = useState("");
  let [hrdId, setHrdId] = useState("");

  const addFeature = (feature, name, uniqueId, hrdId, parcelData = null) => {

    let newFeature = {
      type: "Feature",
      properties: {},
      geometry: {}
    }

    let newProps = {
      name: name,
      id: uniqueId,
      hrd_id: hrdId
    };

    newFeature.properties = newProps;

    if (parcelData) {
      let combined = combine(featureCollection(parcelData));
      console.log(combined.features[0].geometry);
      newFeature.geometry = combined.features[0].geometry;
    }

    let esriFeature = geojsonToArcGIS(newFeature);

    console.log(esriFeature);

    addFeatures({
      url: `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/DevLayer_rough_cut/FeatureServer/0`,
      features: [esriFeature],
      authentication: session,
    }).then((response) => {
      console.log(response);
      if (response.addResults[0].success) {
        setParcels([]);
        setUpdateDevs(updateDevs + 1);
        setAddNew(false)
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
        <div>
          <p className="font-bold">Project Name</p>
          <input
            type="text"
            className="p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <p className="font-bold">Unique ID</p>
          <input
            type="text"
            className="p-2 w-full"
            value={uniqueId}
            onChange={(e) => setUniqueId(e.target.value)}
          />
        </div>

        <div>
          <p className="font-bold">HRD ID</p>
          <input
            type="text"
            className="p-2 w-full"
            value={hrdId}
            onChange={(e) => setHrdId(e.target.value)}
          />
        </div>

        <button
          className="mt-2"
          onClick={() =>
            addFeature(development, name, uniqueId, hrdId, parcelData)
          }
        >
          Create new project
        </button>
      </section>
    </div>
  );
};

export default NewProject;
