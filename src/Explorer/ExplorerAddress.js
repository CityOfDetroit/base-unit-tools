
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import layers from '../data/layers';
import ExplorerFeature from './ExplorerFeature';
import IdBadge from './IdBadge';

export const addressAttributes = {
  "Street Number": `street_number`,
  "Street Prefix": `street_prefix`,
  "Street Name": `street_name`,
  "Street Type": `street_type`,
  "Unit Type": `unit_type`,
  "Unit Number": `unit_number`
}

const ExplorerAddress = ({ feature, clicked, setClicked, linked, setLinked }) => {

  let attributes = {}
  let { attributes: attr } = feature;

  Object.keys(addressAttributes).forEach(k => {
    attributes[k] = feature.attributes[addressAttributes[k]]
  })

  useEffect(() => {
    if (feature) {
      console.log("Attributes")
      console.log(attributes)

      console.log(attr)

      console.log("clicked")
      console.log(clicked)

      setLinked({
        addresses: [],
        parcels: [feature.attributes.parcel_id],
        buildings: [feature.attributes.bldg_id],
        streets: [feature.attributes.street_id],
      })
    }
  }, [feature, setLinked])

  return (
    <>
      <ExplorerFeature {...{ attr, attributes, clicked }} />
      {attr.parcel_id ? <section className='sidebar-section' style={{ borderLeft: `8px solid ${layers['parcels'].color}` }}>
        <div className="flex items-center justify-between" >
          <h2 className="text-sm md:text-base">linked to parcel:</h2>
          <IdBadge layer={layers['parcels']} id={attr.parcel_id} setClicked={setClicked} link />
        </div>
      </section> :
        <section className='sidebar-section warning flex items-center' >
          <FontAwesomeIcon icon={faExclamationCircle} className="mr-3" />
          <p className="font-semibold">There is no linked parcel for this address!</p>
        </section>
      }
      {attr.bldg_id && <section className='sidebar-section' style={{ borderLeft: `8px solid ${layers['buildings'].color}` }}>
        <div className="flex items-center justify-between" >
          <h2 className="text-sm md:text-base">linked to building:</h2>
          <IdBadge layer={layers['buildings']} id={attr.bldg_id} setClicked={setClicked} link />
        </div>
      </section>
      }

      {attr.street_id ? <section className='sidebar-section' style={{ borderLeft: `8px solid ${layers['streets'].color}` }}>
        <div className="flex items-center justify-between" >
          <h2 className="text-sm md:text-base">linked to street:</h2>
          <IdBadge layer={layers['streets']} id={attr.street_id} setClicked={setClicked} link />
        </div>
      </section> :
        <section className='sidebar-section warning flex items-center justify-between' >
          <div className="flex items-center">
            <FontAwesomeIcon icon={faExclamationCircle} className="mr-3" />
            <p className="font-semibold">There is no linked street for this address!</p>
          </div>
        </section>}
    </>
  )
}

export default ExplorerAddress;