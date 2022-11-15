/*
Flow:
searchValue -> 
if businessSearch: address -> geocoder -> addressId -> various dataset queries

if addressSearch
(if businesslicenses data not set after address id is obtained, query for it)
*/
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { queryFeatures } from '@esri/arcgis-rest-feature-layer';
import Button from '../components/Button';
import BusinessTruthSearchOptions from './BusinessTruthSearchOptions';
import {useGeocoder} from '../hooks/useGeocoder';
import useLayer from '../hooks/useLayer';

// sample response from geocoder
/*
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -83.0454705,
                    42.32889900000001
                ]
            },
            "properties": {
                "address": "1 Woodward Ave, Detroit, 48226",
                "score": 97.53,
                "Status": "M",
                "Score": 97.53,
                "Match_addr": "1 Woodward Ave, Detroit, 48226",
                "LongLabel": "1 Woodward Ave, Detroit, 48226",
                "ShortLabel": "1 Woodward Ave",
                "Addr_type": "PointAddress",
                "Type": "",
                "PlaceName": "",
                "Place_addr": "1 Woodward Ave, Detroit, 48226",
                "Phone": "",
                "URL": "",
                "Rank": 20,
                "AddBldg": "",
                "AddNum": "1",
                "AddNumFrom": "",
                "AddNumTo": "",
                "AddRange": "",
                "Side": "",
                "StPreDir": "",
                "StPreType": "",
                "StName": "Woodward",
                "StType": "Ave",
                "StDir": "",
                "BldgType": "",
                "BldgName": "",
                "LevelType": "",
                "LevelName": "",
                "UnitType": "",
                "UnitName": "",
                "SubAddr": "",
                "StAddr": "1 Woodward Ave",
                "Block": "",
                "Sector": "",
                "Nbrhd": "",
                "District": "",
                "City": "Detroit",
                "MetroArea": "",
                "Subregion": "",
                "Region": "",
                "RegionAbbr": "",
                "Territory": "",
                "Zone": "",
                "Postal": "48226",
                "PostalExt": "3430",
                "Country": "",
                "LangCode": "ENG",
                "Distance": 0,
                "X": -83.0454705,
                "Y": 42.32889900000001,
                "DisplayX": -83.0454705,
                "DisplayY": 42.32889900000001,
                "Xmin": -83.0464705,
                "Xmax": -83.04447049999999,
                "Ymin": 42.32789900000001,
                "Ymax": 42.329899000000005,
                "ExInfo": "",
                "council_district": "6",
                "geo_source": "building",
                "address_id": 290672,
                "building_id": "624",
                "parcel_id": "02001910-5",
                "street_id": "34773"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -83.04453716281343,
                    42.32846872323672
                ]
            },
            "properties": {
                "address": "1 Woodward Ave",
                "score": 97.53,
                "Status": "M",
                "Score": 97.53,
                "Match_addr": "1 Woodward Ave",
                "LongLabel": "1 Woodward Ave",
                "ShortLabel": "1 Woodward Ave",
                "Addr_type": "StreetAddress",
                "Type": "",
                "PlaceName": "",
                "Place_addr": "1 Woodward Ave",
                "Phone": "",
                "URL": "",
                "Rank": 20,
                "AddBldg": "",
                "AddNum": "1",
                "AddNumFrom": "169",
                "AddNumTo": "1",
                "AddRange": "1-169",
                "Side": "R",
                "StPreDir": "",
                "StPreType": "",
                "StName": "Woodward",
                "StType": "Ave",
                "StDir": "",
                "BldgType": "",
                "BldgName": "",
                "LevelType": "",
                "LevelName": "",
                "UnitType": "",
                "UnitName": "",
                "SubAddr": "",
                "StAddr": "1 Woodward Ave",
                "Block": "",
                "Sector": "",
                "Nbrhd": "",
                "District": "",
                "City": "",
                "MetroArea": "",
                "Subregion": "",
                "Region": "",
                "RegionAbbr": "",
                "Territory": "",
                "Zone": "",
                "Postal": "",
                "PostalExt": "",
                "Country": "",
                "LangCode": "ENG",
                "Distance": 0,
                "X": -83.04453716281343,
                "Y": 42.32846872323672,
                "DisplayX": -83.04453716281343,
                "DisplayY": 42.32846872323672,
                "Xmin": -83.04553716281343,
                "Xmax": -83.04353716281342,
                "Ymin": 42.32746872323672,
                "Ymax": 42.329468723236715,
                "ExInfo": "",
                "council_district": "",
                "geo_source": "",
                "address_id": 0,
                "building_id": "",
                "parcel_id": "",
                "street_id": ""
            }
        }
    ]
}
*/

// TODO: replace setGeocoded w/ SetBusinessData. Have a state-based value called businessData in the main page

// Use this section to send queries to AGO, and call setBusinessData() to ensure the data can be used in the Business Truth page

// may not need to call useGeocoder at all. should be able to get data from the lat/lon columns AGO returns

// maybe the first search target should be Parcels?

// TODO: Maybe retrieve all business licenses on page load (or after entering the first letter) and calculate levenshtein distance as you're typing?

const BusinessTruthSearch = ({ setClicked, setGeocoded, setBusinessTruthData }) => {

  // an options object for storing if it's a business name search or address search
  // searchType options: ['business', 'address']
  let [options, setOptions] = useState({
    searchType: 'default'
  });

  useEffect(() => {
    console.log("options")
    console.log(options)
  }, [options])

  // TODO: refactor to one object that contains all data
  let [businessTruthResults
     , setBusinessTruthResults] = useState({
    "business_licenses": {}
  }) // final full results that will be returned to the main page using setBusinessTruthData

  let [value, setValue] = useState("")
  let [searchValue, setSearchValue] = useState("")
  let [searchResults, setSearchResults] = useState(null) // hold the search results for the first query, e.g. the Business Name query
  let [address, setAddress] = useState(null)
  let [featureCollection, type] = useGeocoder(address)
  let [addressId, setAddressId] = useState(null)

  let [establishmentId, setEstablishmentId] = useState(null)// used for restaurant data
  
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
    console.log("Current addressId: " + addressId)
  }, [addressId])


  // conduct the initial search
  useEffect(() => {
    // clear out previous data
    setBusinessTruthData({})
    setAddressId(null)
    setEstablishmentId(null)

    setAddress(searchValue)
  }, [searchValue])

  /*
  //TODO: instead of Search Results, use a businessLicensesData variable?
  // once the initial search's value is obtained, get address id to query for more data
  useEffect(() => {
    if (searchResults != null){
      console.log("Search Results")
      console.log(searchResults)
      if(searchResults.features.length > 0){
        //TODO: Switch to a Levenshtein distance style to select the correct result

        // once the search result is retrieved, bring the user to it
        let firstResult = searchResults.features[0]
        let address = [firstResult.attributes.street_dir, firstResult.attributes.street_name, firstResult.attributes.street_num].join(' ')
        
        // set the address variable, adjusting the value fed to the geocoder. This will cause the geocoder to run, which will set the address id and trigger more dataset queries
        setAddress(address)

        // set the addressId, in order to query for more datasets
        // setAddressId(firstResult.attributes.address_id)

        // send the business truth data back to the main page
        // TODO: may need to move this after more datasets are joined
        //setBusinessTruthData(firstResult)
        let businessLicensesData = {
          "business_licenses": firstResult
        }
        //setBusinessTruthResults(businessLicensesData)

        setBusinessTruthData(businessLicensesData)
      }
      else{
        console.log("No Results")
      }
    }
  }, [searchResults])
  */

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

  // when we get a new clicked feature or geocoding result, reset.
  useEffect(() => {
    let firstResult = featureCollection?.features[0]
    console.log(featureCollection)
    console.log("Geocoding result")
    console.log(firstResult)
    if (firstResult && firstResult.properties.Addr_type === 'PointAddress') {
      setClicked({
        type: 'addresses',
        id: firstResult.properties.address_id
      })
      setGeocoded(featureCollection)

      // set the addressId, in order to query for more datasets
      setAddressId(firstResult.properties.address_id)
      
    }
    //TODO: add setAddressId here?
    else if (firstResult && ['StreetAddress', 'StreetInt'].indexOf(firstResult.properties.Addr_type) > -1) {
      setClicked({})
      setGeocoded(featureCollection)

      setAddressId(firstResult.properties.address_id)
    }
    if(!featureCollection) {
      setClicked({})
      setGeocoded({type: "FeatureCollection", features: [], input: searchValue})
    }
  }, [featureCollection, type])

  return (
    <div>
    <div className="flex items-center justify-start text-sm md:text-base w-full bg-gray-200 p-2 md:p-3">
      <input
        className="p-2 w-full md:w-1/2"
        type="text"
        value={value}
        placeholder={`Search for an address or intersection`}
        onChange={(e) => setValue(e.target.value)} 
        onKeyPress={(e) => e.code === 'Enter' && setSearchValue(value)}
        />
      <Button
        active={value !== ''}
        disabled={value === ''}
        small
        className="py-2"
        onClick={() => setSearchValue(value)}
        text='Search'
        icon={faSearch} />
    </div>
    <div className="flex items-center justify-start text-sm md:text-base w-full bg-gray-200 p-2 md:p-3">
      <BusinessTruthSearchOptions options={options} setOptions={setOptions} />
    </div>
    </div>
  )
}

export default BusinessTruthSearch;