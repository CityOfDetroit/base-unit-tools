import React from "react";

const SelectedParcel = ({ parcel, parcelData }) => {
  return (
    <div className="border-b-2 py-1">
      <p className="font-bold">{parcel}</p>
      <p>
        {parcelData && parcelData.properties.address} owned by{" "}
        {parcelData && parcelData.properties.taxpayer_1}
      </p>
    </div>
  );
};

export default SelectedParcel;