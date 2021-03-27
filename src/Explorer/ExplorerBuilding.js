import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import AddressesHere from './AddressesHere';
import ExplorerFeature from './ExplorerFeature';
import types from '../data/building_types.json'
import IdBadge from './IdBadge';
import layers from '../data/layers'

const ExplorerBuilding = ({ feature, clicked, setClicked, linked, setLinked }) => {

  let { geometry: geom, attributes: attr } = feature;

  let attributes = {
    "Use type": attr.use_category,
    "Building type": attr.ted_build_type,
    "SEMCOG building type": types[attr.semcog_build_type],
    "SEMCOG unit count": attr.semcog_housing_units
  }

  let [addresses, setAddresses] = useState([])

  useEffect(() => {
    let url = `https://opengis.detroitmi.gov/opengis/rest/services/BaseUnits/AddressPoints/FeatureServer/0/query?`
    let params = {
      where: `bldg_id = ${attr.bldg_id}`,
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
            setLinked({
              buildings: [],
              addresses: d.features.map(f => f.attributes.addr_id),
              streets: Array.from(new Set(d.features.map(f => f.attributes.street_id))),
              parcels: Array.from(new Set(d.features.map(f => f.attributes.parcel_id)))
            })
          }
          else {
            setAddresses([])
            setLinked({
              buildings: [],
              addresses: [],
              streets: [],
              parcels: []
            })
          }
        }
      })

  }, [attr.bldg_id])

  return (
    <>
      <ExplorerFeature {...{ attr, attributes, clicked }} />
      <section className='sidebar-section' style={{ borderLeft: `4px solid ${layers['parcels'].color}` }}>
        <div className="flex items-center justify-between" >
          <h2 className="text-base">linked to parcel:</h2>
          <IdBadge id={attr.parcel_id} layer={layers['parcels']} link setClicked={setClicked} />
        </div>
      </section>
      {addresses.length > 0 && <AddressesHere {...{ addresses, setClicked }} />}
    </>
  )
}

export default ExplorerBuilding;