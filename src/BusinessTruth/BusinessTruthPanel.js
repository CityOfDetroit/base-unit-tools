
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import layers from '../data/layers';
import BusinessTruthFeature from './BusinessTruthFeature';

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

clicked example (stored address_id and type)
{
    "type": "addresses",
    "id": 183188
}
*/

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

  return (
    <>
      <BusinessTruthFeature attr={sourceAttributes} attributes={displayAttributes} stylingType={datasetType} />
    </>
  )
}

export default BusinessTruthPanel;