import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import businessTruthTypes from '../data/businessTruthTypes';
import BusinessTruthFeature from './BusinessTruthFeature';
import IdBadge from '../Explorer/IdBadge';

const BusinessTruthRestaurant = ({ establishmentData, inspectionData, violationData, activeRestaurantDataset, setActiveRestaurantDataset }) => {

  const renderLinkedEstablishments = (previous_type) => {
    if(establishmentData.sourceAttributes?.establishment_id){
      return (
        <section className='sidebar-section' style={{ borderLeft: `8px solid ${establishmentData.style.color}` }}>
          <div className="flex items-center justify-between" >
            <h2 className="text-sm md:text-base">linked to establishment:</h2>
              <IdBadge 
                layer={businessTruthTypes["restaurant_establishments"]} 
                id={establishmentData.sourceAttributes?.establishment_id} 
                setClicked={() => {
                  setActiveRestaurantDataset({
                    type: 'restaurant_establishments',
                    filter_id: establishmentData.sourceAttributes?.establishment_id,
                    previous_type: [previous_type]
                  })
                }} 
                link 
              />
            </div>
        </section> 
      )
    }
    else{
      return <></>
    }
  }

  const renderLinkedInspections = (previous_type) => {
    if(inspectionData.sourceAttributes?.Inspection_ID){
      return (
        <section className='sidebar-section' style={{ borderLeft: `8px solid ${establishmentData.style.color}` }}>
          <div className="flex items-center justify-between" >
            <h2 className="text-sm md:text-base">linked to inspection:</h2>
              <IdBadge 
                layer={businessTruthTypes["restaurant_establishments"]} 
                id={inspectionData.sourceAttributes?.Inspection_ID} 
                setClicked={() => {
                  setActiveRestaurantDataset({
                    type: 'restaurant_inspections',
                    filter_id: inspectionData.sourceAttributes?.Inspection_ID,
                    previous_type: [previous_type]
                  })
                }} 
                link 
              />
            </div>
        </section> 
      )
    }
    else{
      return <></>
    }
  }

  // need to pass infilter_id to switch between filtering violations by establishments or inspecitons
  const renderLinkedViolations = (previous_type) => {
    if(violationData.length > 0){
      return (
        <section className='sidebar-section' style={{ borderLeft: `8px solid ${establishmentData.style.color}` }}>
          <div className="flex items-center justify-between" >
            <h2 className="text-sm md:text-base">linked to violations:</h2>
              <IdBadge 
                layer={businessTruthTypes["restaurant_establishments"]} 
                id="Violations" 
                setClicked={() => {
                  setActiveRestaurantDataset({
                    type: 'restaurant_violations',
                    filter_id: establishmentData.sourceAttributes?.Establishment_ID,
                    previous_type: [previous_type]
                  })
                }} 
                link 
              />
            </div>
        </section> 
      )
    }
    else{
      return <></>
    }
  }

  const render = () => {
    if(activeRestaurantDataset.type == "restaurant_establishments"){
      // display linked inspections
      return(
        <div>
          <BusinessTruthFeature dataset={establishmentData}>

          </BusinessTruthFeature>
          {renderLinkedInspections("restaurant_establishments")}
          {renderLinkedViolations("restaurant_establishments")}
        </div>
      )
    }
    else if(activeRestaurantDataset.type == "restaurant_inspections"){
      return(
        <div>
          <BusinessTruthFeature dataset={inspectionData}>

          </BusinessTruthFeature>
          {renderLinkedEstablishments("restaurant_inspections")}
          {renderLinkedViolations("restaurant_inspections")}
        </div>
      )
    }
  }

  return (
    <div>
      {
        render()
      }
    </div>
  )
}

export default BusinessTruthRestaurant;

const BusinessTruthRestaurantOld = ({ dataset, inspectionData, handleInspectionChange, violationData, handleViolationChange}) => {

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

  const renderLinkedDataset = (linkedDataset, idKey, name) => {
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
                <IdBadge layer={businessTruthTypes["restaurant_establishments"]} id={linkedDataset.sourceAttributes?.[idKey]} setClicked={handleInspectionChange} link />
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
        /**
         * display associated inspections
         * inspectionData.sourceAttributes?.Inspection_ID && ?
         */
        renderLinkedDataset(inspectionData, "Inspection_ID", "inspection")
      }
      {
        
        renderLinkedDataset(violationData, "Establishment_ID", "violation")
        
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

//export default BusinessTruthRestaurantOld;