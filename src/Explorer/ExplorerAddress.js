
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import layers from '../data/layers';
import ExplorerFeature from './ExplorerFeature';
import IdBadge from './IdBadge';

const ExplorerAddress = ({ feature, clicked, setClicked, linked, setLinked }) => {

  let { attributes: attr } = feature;

  let attributes = {
    "Street Number": attr.street_number,
    "Street Prefix": attr.street_prefix,
    "Street Name": attr.street_name,
    "Street Type": attr.street_type,
    "Unit Type": attr.unit_type,
    "Unit Number": attr.unit_number
  }

  useEffect(() => {
    if (feature) {
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
      {attr.parcel_id ? <section className='sidebar-section' style={{ borderLeft: `4px solid ${layers['parcels'].color}` }}>
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
      {attr.bldg_id && <section className='sidebar-section' style={{ borderLeft: `4px solid ${layers['buildings'].color}` }}>
        <div className="flex items-center justify-between" >
          <h2 className="text-sm md:text-base">linked to building:</h2>
          <IdBadge layer={layers['buildings']} id={attr.bldg_id} setClicked={setClicked} link />
        </div>
      </section>
      }

      {attr.street_id ? <section className='sidebar-section' style={{ borderLeft: `4px solid ${layers['streets'].color}` }}>
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