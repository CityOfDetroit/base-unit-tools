
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import businessTruthTypes from '../data/businessTruthTypes';
import BusinessTruthFeature from './BusinessTruthFeature';
import IdBadge from '../Explorer/IdBadge';

const BusinessTruthRestaurantInspection = ({ dataset, establishmentData, activeRestaurantDataset, setActiveRestaurantDataset}) => {

  useEffect(() => {
    if (dataset) {
      console.log("Dataset")
      console.log(dataset)

      console.log("ActiveRes")
      console.log(activeRestaurantDataset)

      /*
      setLinked({
        addresses: [],
        parcels: [feature.attributes.parcel_id],
        buildings: [feature.attributes.bldg_id],
        streets: [feature.attributes.street_id],
      })
      */
    }
  }, [dataset])

  //dataset.sourceAttributes?.inspection_id
  return (
    <>
      <BusinessTruthFeature dataset={dataset} />
      {establishmentData.sourceAttributes?.establishment_id
      ? <section className='sidebar-section' style={{ borderLeft: `8px solid ${dataset.style.color}` }}>
        <div className="flex items-center justify-between" >
          <h2 className="text-sm md:text-base">linked to establishment:</h2>
          <IdBadge layer={businessTruthTypes["restaurant_establishments"]} id={establishmentData.sourceAttributes?.establishment_id} setClicked={setActiveRestaurantDataset} link />
        </div>
      </section> 
      :<section className='sidebar-section warning flex items-center justify-between' >
          <div className="flex items-center">
            <FontAwesomeIcon icon={faExclamationCircle} className="mr-3" />
            <p className="font-semibold">There is no linked establishment for this inspection!</p>
          </div>
        </section>}
    </>
  )
}

export default BusinessTruthRestaurantInspection;