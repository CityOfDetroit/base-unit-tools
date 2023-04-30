import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";

const SelectedParcel = ({ parcel, parcelData }) => {
  return (
    <div className="py-1 w-full text-sm">
      <div className="flex items-center justify-between w-full">
        <span>{parcelData && parcelData.properties.address}</span>
        <span className="font-bold">{parcel}</span>
      </div>
      <p className="w-full text-right m-0 p-0">{parcelData && parcelData.properties.taxpayer_1}</p>
    </div>
  );
};

const SelectedParcels = ({ parcels, parcelData, setParcels, setAddNew, addNew, currentDevelopment }) => {
  console.log(addNew)
  return (
    <div className="mt-4">
      <div className=" text-gray-700 font-bold px-2 py-1 text-sm flex items-center justify-between bg-green-200">
        <span>Selected parcels ({parcels.length})</span>
        <FontAwesomeIcon icon={faWindowClose} onClick={() => setParcels([])} />
      </div>
      <section className="sidebar-section">
        {parcels.map((parcel) => (
          <SelectedParcel
            parcel={parcel}
            parcelData={parcelData.find(
              (p) => p.properties.parcel_number === parcel
            )}
            key={parcel}
          />
        ))}
      {!addNew && !currentDevelopment &&<button className="w-full mt-4" onClick={() => setAddNew(true)}>
        Add new project from these parcels
      </button>}
      </section>
    </div>
  );
};

export default SelectedParcels;
