// temporarily hold code we want to remove from BusinessTruthSearch

import React, { useEffect, useState } from 'react';

const temp = () => {
    let businessLicensesUrl = `https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/BusinessLicenses/FeatureServer/0/`
    let businessLicensesData = useLayer(
      {
        url: businessLicensesUrl,
        where: `address_id = ${addressId}`,
        acceptNull: false
      }
    ) 
  
    let commercialCocUrl = `https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/CommercialInspections/FeatureServer/0`
    let commercialCocData = useLayer(
      {
        url: commercialCocUrl,
        where: `address_id = ${addressId}`,
        acceptNull: false
      }
    ) 
  
    let certificateOfOccupancyUrl = `https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/CertificateOfOccupancy/FeatureServer/0`
    let certificateOfOccupancyData = useLayer(
      {
        url: certificateOfOccupancyUrl,
        where: `address_id = ${addressId}`,
        acceptNull: false
      }
    ) 
  
    let restaurantEstablishmentsUrl = `https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/Restaurant_Establishments/FeatureServer/0`
    let restaurantEstablishmentsData = useLayer(
      {
        url: restaurantEstablishmentsUrl,
        where: `address_id = ${addressId}`,
        orderByFields: 'most_recent_license_date desc',
        acceptNull: false
      }
    ) 
  
    let restaurantInspectionsUrl = `https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/Restaurant_Inspections/FeatureServer/0`
    let restaurantInspectionsData = useLayer(
      {
        url: restaurantInspectionsUrl,
        where: `establishment_id = ${establishmentId}`,
        orderByFields: 'inspection_date desc',
        acceptNull: false
      }
    ) 
  
    let restaurantViolationsUrl = `https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/Violations_Cited_per_Restaurant_Inspection/FeatureServer/0`
    let restaurantViolationsData = useLayer(
      {
        url: restaurantViolationsUrl,
        where: `establishment_id = ${establishmentId}`,
        orderByFields: 'inspection_date desc',
        acceptNull: false
      }
    ) 

    useEffect(() => {
        if(businessLicensesData){
          console.log("businessLicenses")
          console.log(businessLicensesData)
    
          if(businessLicensesData.features.length > 0){
            let firstResult = businessLicensesData.features[0]
            setBusinessTruthData(prevState => (
              {
                ...prevState,
                "business_licenses": firstResult
              }
            ))
          }
          else{
            console.log("No businessLicenses data")
            setBusinessTruthData(prevState => (
              {
                ...prevState,
                "business_licenses": null
              }
            ))
          }
        }
      }, [businessLicensesData])
    
      useEffect(() => {
        if(commercialCocData){
          console.log("Commercial coc")
          console.log(commercialCocData)
    
          if(commercialCocData.features.length > 0){
            let firstResult = commercialCocData.features[0]
            setBusinessTruthData(prevState => (
              {
                ...prevState,
                "commercial_coc": firstResult
              }
            ))
          }
          else{
            console.log("No Commercial Coc data")
            setBusinessTruthData(prevState => (
              {
                ...prevState,
                "commercial_coc": null
              }
            ))
          }
        }
      }, [commercialCocData])
    
      useEffect(() => {
        if(certificateOfOccupancyData){
    
          if(certificateOfOccupancyData.features.length > 0){
            let firstResult = certificateOfOccupancyData.features[0]
            setBusinessTruthData(prevState => (
              {
                ...prevState,
                "certificate_of_occupancy": firstResult
              }
            ))
          }
          else{
            console.log("No COO data")
            setBusinessTruthData(prevState => (
              {
                ...prevState,
                "certificate_of_occupancy": null
              }
            ))
          }
        }
      }, [certificateOfOccupancyData])
    
      useEffect(() => {
        if(restaurantEstablishmentsData){
    
          if(restaurantEstablishmentsData.features.length > 0){
            console.log("Restaurant Data")
            console.log(restaurantEstablishmentsData.features)
            let firstResult = restaurantEstablishmentsData.features[0]
            setBusinessTruthData(prevState => (
              {
                ...prevState,
                "restaurant_establishments": firstResult
              }
            ))
    
            setEstablishmentId(firstResult.attributes.establishment_id)
          }
          else{
            console.log("No restaurantEstablishments data")
            setBusinessTruthData(prevState => (
              {
                ...prevState,
                "restaurant_establishments": null
              }
            ))
          }
        }
      }, [restaurantEstablishmentsData])
    
      useEffect(() => {
        if(restaurantInspectionsData){
    
          if(restaurantInspectionsData.features.length > 0){
            let firstResult = restaurantInspectionsData.features[0]
            setBusinessTruthData(prevState => (
              {
                ...prevState,
                "restaurant_inspections": firstResult
              }
            ))
          }
          else{
            console.log("No restaurantInspections data")
          }
        }
      }, [restaurantInspectionsData])
    
      useEffect(() => {
        //restaurant violations returns all violations
        if(restaurantViolationsData){
    
          if(restaurantViolationsData.features.length > 0){
            let firstResult = restaurantViolationsData.features[0]
            setBusinessTruthData(prevState => (
              {
                ...prevState,
                "restaurant_violations": restaurantViolationsData.features //firstResult
              }
            ))
          }
          else{
            console.log("No restaurantViolations data")
          }
        }
      }, [restaurantViolationsData])
}