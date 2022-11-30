
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import businessTruthTypes from '../data/businessTruthTypes';
import BusinessTruthFeature from './BusinessTruthFeature';
import IdBadge from '../Explorer/IdBadge';

const BusinessTruthRestaurantViolation = ({ dataset, establishmentData, handleEstablishmentChange, inspectionData, handleInspectionChange}) => {

  useEffect(() => {
    if (dataset) {
      console.log("Dataset")
      console.log(dataset)

      console.log("inspection data")
      console.log(inspectionData)

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

  const renderLinkedDataset = (linkedDataset, idKey, name, onClick) => {
    if(linkedDataset.data){
      // if an array of data was passed in
      if(linkedDataset.displayAttributes?.constructor?.name == "Array"){
        //can return a single business truth feature, due to the inherit pagination
        console.log("test")
        console.log(linkedDataset.data)
        //return (<p>test</p>)
        
        return (
          <section className='sidebar-section' style={{ borderLeft: `8px solid ${dataset.style.color}` }}>
            <div className="flex items-center justify-between" >
              <h2 className="text-sm md:text-base">linked to {name}:</h2>
              <IdBadge layer={businessTruthTypes["restaurant_establishments"]} id={"Violations"} setClicked={handleViolationChange} link />
            </div>
          </section> 
        )
        
        /*
        return (
        <div>
          <Pagination style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }} count={maxPageCount} page={page} onChange={handlePageChange} size="small" />
          <AttributeTable attributes={dataset.displayAttributes[page-1]} metadata={dataset.displayMetadata} />
          <Pagination style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }} count={maxPageCount} page={page} onChange={handlePageChange} size="small" />
        </div>
        )
        */
      }
      // if a single object of data was passed in
      else{
        if(linkedDataset.sourceAttributes?.Establishment_ID == dataset.sourceAttributes?.establishment_id){
          return (
            <section className='sidebar-section' style={{ borderLeft: `8px solid ${dataset.style.color}` }}>
              <div className="flex items-center justify-between" >
                <h2 className="text-sm md:text-base">linked to {name}:</h2>
                <IdBadge layer={businessTruthTypes["restaurant_establishments"]} id={linkedDataset.sourceAttributes?.[idKey]} setClicked={onClick} link />
              </div>
            </section> 
          )
        }
        else{
          return <></>
          /*
          return (
            <section className='sidebar-section warning flex items-center justify-between' >
              <div className="flex items-center">
                <FontAwesomeIcon icon={faExclamationCircle} className="mr-3" />
                <p className="font-semibold">There is no linked {name} for this restaurant!</p>
              </div>
            </section>
          )
          */
        }
      }
    }
    return <></> //<p>No Data</p>
  }

  return (
    <>
      <BusinessTruthFeature dataset={dataset} />
      {
        
        renderLinkedDataset(establishmentData, "Establishment_ID", "establishment", handleEstablishmentChange)
        
      }
      {
        /**
         * display associated inspections
         * inspectionData.sourceAttributes?.Inspection_ID && ?
         */
        renderLinkedDataset(inspectionData, "Inspection_ID", "inspection", handleInspectionChange)
      }
      {
        /*
        inspectionData.sourceAttributes?.Establishment_ID == dataset.sourceAttributes?.establishment_id
        ? <section className='sidebar-section' style={{ borderLeft: `8px solid ${dataset.style.color}` }}>
          <div className="flex items-center justify-between" >
            <h2 className="text-sm md:text-base">linked to inspection:</h2>
            <IdBadge layer={businessTruthTypes["restaurant_establishments"]} id={inspectionData.sourceAttributes?.Inspection_ID} setClicked={handleInspectionChange} link />
          </div>
        </section> 
        :<section className='sidebar-section warning flex items-center justify-between' >
            <div className="flex items-center">
              <FontAwesomeIcon icon={faExclamationCircle} className="mr-3" />
              <p className="font-semibold">There is no linked inspection for this restaurant!</p>
            </div>
          </section>
          */

        /**
         * display associated violations
         */
        /*
        violationData.sourceAttributes?.Establishment_ID == dataset.sourceAttributes.establishment_id
        ? <section className='sidebar-section' style={{ borderLeft: `8px solid ${dataset.style.color}` }}>
          <div className="flex items-center justify-between" >
            <h2 className="text-sm md:text-base">linked to inspection:</h2>
            <IdBadge layer={businessTruthTypes["restaurant_establishments"]} id={violationData.sourceAttributes?.Inspection_ID} setClicked={handleViolationChange} link />
          </div>
        </section> 
        :<section className='sidebar-section warning flex items-center justify-between' >
            <div className="flex items-center">
              <FontAwesomeIcon icon={faExclamationCircle} className="mr-3" />
              <p className="font-semibold">There is no linked violations for this restaurant!</p>
            </div>
          </section>
          */
      }
    </>
  )
}

export default BusinessTruthRestaurantViolation;