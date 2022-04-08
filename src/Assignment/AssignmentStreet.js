import useFeature from '../hooks/useFeature';
import layers from '../data/layers';
import { useState, useEffect } from 'react';
import AssignmentAddressesHere from './AssignmentAddressesHere';
import AssignmentFeature from './AssignmentFeature';

const AssignmentStreet = ({ street, addresses, setAddresses }) => {

  let feature = useFeature({
    type: 'streets',
    id: street,
    f: 'geojson'
  })

  useEffect(() => {
    let url = layers.addresses.endpoint + `/query?`
    let params = {
      where: `street_id = ${street} AND unit_type is null AND unit_number is null`,
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
          }
          else {
            setAddresses([])
          }
        }
      })

  }, [street])

  let clicked = { type: 'streets', id: street }

  let { properties: attr } = feature ? feature : {};

  // lookup for legalsystem attribute
  let legalSystems = {
    0: `Non-Act 51 certified`,
    1: `State trunkline`,
    2: `County primary`,
    3: `County local`,
    4: `City major`,
    5: `City minor`,
    7: `Other public entity`
  }

  let attributes = {}
  if(feature) {
    attributes = {
        "Street direction": attr.street_prefix,
        "Street name": attr.street_name,
        "Street type": attr.street_type,
        "MGF - Left range": `${attr.fraddl}-${attr.toaddl}`,
        "MGF - Right range": `${attr.fraddr}-${attr.toaddr}`,
        // "Jurisdiction": legalSystems[attr.legalsystem],
        // "Functional class code": attr.fcc,
        "Length of segment": attr.segment_length ? `${attr.segment_length.toFixed(0)} ft`: `?`
    }
  }

  // if (feature) {
  //   attributes = {
  //     "Use type": feature.properties.use_category,
  //     "Building type": feature.properties.ted_build_type
  //   }
  // }

  return (
    <>
      {feature && <AssignmentFeature startOpen {...{ attr: feature.properties, attributes, clicked: clicked }} />}
      {addresses.length > 0 && <AssignmentAddressesHere {...{ addresses, title: "primary" }} />}
    </>
  )
}

export default AssignmentStreet;