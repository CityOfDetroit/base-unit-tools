import { useEffect, useState } from 'react';
import layers from '../data/layers';
import AssignmentAddressesHere from './AssignmentAddressesHere';
import useFeature from '../hooks/useFeature';
import AssignmentFeature from './AssignmentFeature';

const AssignmentBuilding = ({ building, setStreet, setModelAddress, setSelectableLayers }) => {

  let feature = useFeature({
    type: 'buildings',
    id: building,
    f: 'geojson'
  })

  let [addresses, setAddresses] = useState([])

  useEffect(() => {
    let url = layers.addresses.endpoint + `/query?`
    let params = {
      where: `bldg_id = ${building}`,
      outFields: `*`,
      outSR: 4326,
      f: `pjson`
    }
    let queryString = Object.keys(params).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
    }).join('&');
    fetch(url + queryString)
      .then(r => r.json())
      .then(d => {
        if (Object.keys(d).indexOf('features') > -1) {
          if (d.features.length > 0) {
            setAddresses(d.features.map(f => f.attributes))
            setModelAddress(d.features[0])
            setStreet(d.features[0].attributes.street_id)
          }
          else {
            setAddresses([])
          }
        }
      })

  }, [building])

  let attributes;
  let clicked = { type: 'buildings', id: building }
  if (feature) {
    attributes = {
      "Use type": feature.properties.use_category,
      "Building type": feature.properties.ted_build_type
    }
  }

  return (
    <>
      {feature && <AssignmentFeature {...{ attr: feature.properties, attributes, clicked: clicked }} />}
      {addresses.length > 0 && <AssignmentAddressesHere {...{ addresses, title: "primary" }} />}
    </>
  )
}

export default AssignmentBuilding;