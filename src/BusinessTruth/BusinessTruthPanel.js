/*
attributes example
{
    "Street Number": 14700,
    "Street Prefix": "E",
    "Street Name": "8 Mile",
    "Street Type": "Rd",
    "Unit Type": null,
    "Unit Number": null
}

attr example (geocoder/AGO return)
{
    "OBJECTID": 346299,
    "addr_id": 183188,
    "unit_id": null,
    "bldg_id": 23136,
    "parcel_id": "21028111-131",
    "street_id": 37,
    "street_number": 14700,
    "street_prefix": "E",
    "street_name": "8 Mile",
    "street_type": "Rd",
    "unit_type": null,
    "unit_number": null,
    "zip_code": "48205",
    "zip_four": "1200",
    "geo_source": "building"
}

displayMetadata example
{
    "Business ID": "Unique identifier used to track this business within BSEED's Accela database.",
    "Business Name": "The name of the business, which could be the Doing Business As (DBA) name, an affiliated Limited Liability Company (LLC) or a personal name.",
    "Business Type": "The type of the business as defined by Detroit City Code.",
    "Parcel ID": "Unique number used to track the parcel of land the business is located on. Parcel IDs are assigned by the Office of the Assessor.",
    "Latitude": "Latitudinal coordinate associated with the business street address",
    "Longitude": "Longitudinal coordinate associated with the business street address",
    "Address ID": "Unique address identifier assigned when geocoding the data set with the City of Detroit Base Unit data set.",
    "Street Number": "Street number of the property address where either the business is located or another location where the business owner conducts business.",
    "Street Direction": "Street direction of the property address where either the business is located or another location where the business owner conducts business.",
    "Street Name": "Street name of the property address where either the business is located or another location where the business owner conducts business."
}

clicked example (stored address_id and type)
{
    "type": "addresses",
    "id": 183188
}
*/

import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import layers from '../data/layers';
import BusinessTruthFeature from './BusinessTruthFeature';
import BusinessTruthMetadata from "./BusinessTruthMetadata";

// TODO: replace this with passed-in display names 
// may actually need to declare all column names for all tables here, if we are going to switch tabs
export const addressAttributes = {
  "Street Number": `street_number`,
  "Street Prefix": `street_prefix`,
  "Street Name": `street_name`,
  "Street Type": `street_type`,
  "Unit Type": `unit_type`,
  "Unit Number": `unit_number`
}

// TODO: may need a tab/panel parameter
const BusinessTruthPanel = ({ datasetType, businessTruthData, displayNames }) => {
  let displayAttributes = {}
  let { attributes: sourceAttributes } = businessTruthData;

  Object.keys(displayNames).forEach(k => {
    displayAttributes[k] = businessTruthData.attributes[displayNames[k]]
  })

  // get the metadata
  let metadata = new BusinessTruthMetadata();
  let displayMetadata = metadata.getDisplayMetadata(datasetType, displayNames)

  return (
    <>
      <BusinessTruthFeature attr={sourceAttributes} attributes={displayAttributes} datasetType={datasetType} metadata={metadata} fieldMetadata={displayMetadata}/>
    </>
  )
}

export default BusinessTruthPanel;