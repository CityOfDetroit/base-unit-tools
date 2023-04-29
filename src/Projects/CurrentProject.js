import { geojsonToArcGIS } from "@esri/arcgis-to-geojson-utils";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { featureCollection, combine } from "@turf/turf";
import React, { useEffect, useState } from "react";
import { updateFeatures } from "@esri/arcgis-rest-feature-layer";

const CurrentProject = ({ development, setCurrentDevelopment, parcelData, setParcelData, setParcels, updateDevs, setUpdateDevs, session }) => {
  useEffect(() => {
    setName(development.properties.name);
    setUniqueId(development.properties.id);
    setHrdId(
      development.properties.hrd_id ? development.properties.hrd_id : ""
    );
    setParcels([]);
    setParcelData([]);
  }, [development]);

  let [name, setName] = useState(development.properties.name);
  let [uniqueId, setUniqueId] = useState(development.properties.id);
  let [hrdId, setHrdId] = useState(development.properties.hrd_id);

  const updateFeature = (feature, name, uniqueId, hrdId, parcelData=null) => {
    let updatedFeature = _.cloneDeep(feature);

    let newProps = {
      name: name,
      id: uniqueId,
      hrd_id: hrdId,
      GlobalID: updatedFeature.properties.GlobalID,
      OBJECTID: updatedFeature.properties.OBJECTID,
    }

    updatedFeature.properties = newProps;

    if(parcelData) {
      let combined = combine(featureCollection(parcelData));
      console.log(combined.features[0].geometry);
      updatedFeature.geometry = combined.features[0].geometry;
    }
    
    let esriFeature = geojsonToArcGIS(updatedFeature);

    console.log(esriFeature);

    updateFeatures({
      url: `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/DevLayer_rough_cut/FeatureServer/0`,
      features: [esriFeature],
      authentication: session,
    }).then((response) => {
      console.log(response);
      if(response.updateResults[0].success) {
        setParcels([]);
        setUpdateDevs(updateDevs + 1);
      }
    })
  };

  return (
    <div className="mt-2">
      <div className="bg-purple-200 text-gray-700 font-bold px-2 py-1 text-sm flex items-center justify-between">
        <span>Selected project</span>
        <FontAwesomeIcon icon={faWindowClose} onClick={() => setCurrentDevelopment(null)} />
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
          className="mt-8"
          onClick={() => updateFeature(development, name, uniqueId, hrdId, null)}
        >
          Update project attributes
        </button>

        {parcelData.length > 0 && <button
          className="mt-2"
          onClick={() => updateFeature(development, name, uniqueId, hrdId, parcelData)}
        >
          Update project with selected parcels
        </button>}
      </section>
    </div>
  );
};

export default CurrentProject;
