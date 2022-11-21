/**
 * Business Truth Page
 */

import { faArrowAltCircleRight, faLink, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import useLayer from '../src/hooks/useLayer';
import apps from "../src/data/apps";
import AppHeader from "../src/components/AppHeader";
import Button from "../src/components/Button";
import BusinessTruthDataset from "../src/BusinessTruth/BusinessTruthDataset";
import BusinessTruthPanel from "../src/BusinessTruth/BusinessTruthPanel";
import BusinessTruthSearch from "../src/BusinessTruth/BusinessTruthSearch";
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import IssueReporter from "../src/components/IssueReporter";
import IssueReporterAddress from "../src/components/IssueReporterAddress";
import MapillarySv from "../src/components/MapillarySv";
import SimpleDialog from "../src/components/SimpleDialog";
import SiteSidebar from "../src/layout/SiteSidebar";
import useFeature from "../src/hooks/useFeature";
import ExplorerAddress from "../src/Explorer/ExplorerAddress";
import ExplorerBuilding from "../src/Explorer/ExplorerBuilding";
import ExplorerMap from "../src/Explorer/ExplorerMap";
import ExplorerMapOptions from "../src/Explorer/ExplorerMapOptions";
import ExplorerParcel from "../src/Explorer/ExplorerParcel";
import ExplorerSearch from "../src/Explorer/ExplorerSearch";
import ExplorerStreet from "../src/Explorer/ExplorerStreet";
import BusinessTruthFeature from './../src/BusinessTruth/BusinessTruthFeature';
import { render } from "@testing-library/react";
import BusinessTruthSearchOptions from './../src/BusinessTruth/BusinessTruthSearchOptions';

const BusinessPage = ({ session, setSession, login, setLogin, currentApp }) => {
  // business truth data
  let [businessTruthData, setBusinessTruthData] = useState(null);
  // datasets queried for using address id. Used to check if no data is returned
  const mainDatasets = [ 
    "business_licenses",
    "certificate_of_occupancy",
    "commercial_coc",
    "restaurant_establishments"
  ]

  //Use this to display datasets in the sidebar/main page. Important for the draggable list
  let [displayColumns, setDisplayColumns] = useState(
    {
      sidebar: {
        items: [
          "business_licenses",
          "certificate_of_occupancy",
          "commercial_coc",
          "restaurant_establishments",
          "restaurant_inspections",
          "restaurant_violations"
        ]
      },
      main: {
        items: []
      }
    }
  )


  // check for component mount. Setting initial state to false helps prevent an unnecessary call on initial render
  const didMountRef = useRef(false);

  // query parameters
  let router = useRouter();
  const { type, id, streetview, image } = router.query;
  let queryType = type;
  let queryId = id;
  let querySv = streetview;
  let querySvImgKey = image;

  let initClicked = {type: queryType, id: queryId}
  //console.log(initClicked)

  // this stores the type and id of the currently clicked feature
  // that drives everything, so the value and setter
  // are passed to child components often to consult or use
  /**
   * e.g. 
   * {
        "type": "addresses",
        "id": 545231
    }
   */

  //TODO: need to trigger new search and clear businessTruthData when moving to new clicked address
  let [clicked, setClicked] = useState(initClicked);

  let feature = useFeature(clicked);

  // this stores the current geocoding result
  let [geocoded, setGeocoded] = useState(null);

  // this stores IDs of linked features, to be highlighted on the map.
  let [linked, setLinked] = useState({
    addresses: [],
    parcels: [],
    buildings: [],
    streets: [],
  });

  // an options object
  let [options, setOptions] = useState({
    streetView: querySv === "true" ? true : false,
    basemap: "default",
  });

  // manages dialog box
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  }
  // variabale to check if business truth search is completed. Default is null to represent no search
  const [searchCompleted, setSearchCompleted] = useState(null);

  // streetview-specific information
  // svBearing is the current camera bearing
  const [svBearing, setSvBearing] = useState(null);
  const [svImage, setSvImage] = useState(null);
  const [svImages, setSvImages] = useState([]);

  useEffect(() => {
    console.log("Business Truth")
    console.log(businessTruthData)

    if (didMountRef.current){
      let businessTruthDataKeys = Object.keys(businessTruthData)
      // mainDatasets values should all be in businessTruth data. If they're not, no search has run yet.
      if(mainDatasets.every(val => businessTruthDataKeys.includes(val))){ // Object.keys(businessTruthData).length == mainDatasets.length){
        let noData = true;
        for(let i=0; i<mainDatasets.length; i++){
          let key = mainDatasets[i]
          let data = businessTruthData[key]
          // data exists, so don't show any dialog
          if (data)[
            noData = false
          ]
        }
        // if no data, open the dialog
        if(noData){
          setOpen(true)
        }
      }
    }

    didMountRef.current = true;
  }, [businessTruthData])

  //TODO: change the introduction
  let introduction = (
    <>
      <p>
        This tool is for exploring businesses.
      </p>
      <p>You can start by:</p>
      <ul className="list-disc list-outside ml-4 pb-2">
        <li>Searching for an address</li>
        <li>Clicking a feature on the map</li>
      </ul>
      <p>
        Once an address, building, parcel, or street is selected, you'll be able to see the other
        base units it is linked to.
      </p>
      <p>
        Click the <FontAwesomeIcon icon={faArrowAltCircleRight} className="mx-1 tex" /> next to a
        linked base unit's ID to navigate to that linked unit.
      </p>
      <p>
        You can also see a street view image of the currently selected feature, or turn on satellite
        imagery on the map.
      </p>
    </>
  );

  // Function to handle dragging onto list or dragging onto map
  const onDragEnd = (result, columns, setColumns) => { //businessTruthDisplayOrder, setBusinessTruthDisplayOrder) => {
    //TODO: need a way to check if the destination is in the sidebar or map. Maybe need to use the id?
    
    /*
    destination ex
    {
      "droppableId": "sidebar",
      "index": 4
    }

    source ex
    {
      "index": 3,
      "droppableId": "sidebar"
    }
    */

    // if not dragged to a destination, don't do anything
     /*
    if(!result.destination){
      return
    }
    const {source, destination} = result;
    console.log("Drag End")
    console.log(result)

    if (source.droppableId != destination.droppableId){
      let sourceOrder = null
      if (source.droppableId == "sidebar"){
        sourceOrder = business
      }
    }
    */
    /*
    // if dropping in the map section
    if(destination.droppableId == "main"){

    }

    // if dropping in the sidebar
    if(destination.droppableId == "sidebar"){
      let newDisplayOrder = businessTruthDisplayOrder;
      //remove from source index
      const [itemToMove] = newDisplayOrder.splice(source.index, 1); //remove 1 element at the given index. [] syntax to extract from an array output

      //insert at destination index
      newDisplayOrder.splice(destination.index, 0, itemToMove)

      setBusinessTruthDisplayOrder(newDisplayOrder)
    }
    */
    if(!result.destination){
      return
    }
    const {source, destination} = result;
    console.log("Drag End")
    console.log(result)

    if (source.droppableId != destination.droppableId){
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [itemToMove] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, itemToMove);
      setColumns(
        {
          ...columns,
          [source.droppableId]: {
            ...sourceColumn,
            items: sourceItems
          },
          [destination.droppableId]: {
            ...destColumn,
            items: destItems
          }
        }
      );
    }
    else{
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [itemToMove] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, itemToMove);
      setColumns(
        {
          ...columns,
          [source.droppableId]: {
            ...column,
            items: copiedItems
          }
        }
      );
    }
  }

  let businessLicensesUrl = `https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/BusinessLicenses/FeatureServer/0/`
  let businessLicensesData = useLayer(
    {
      url: businessLicensesUrl,
      where: `address_id = ${clicked.type == "addresses" ? clicked.id : null}`, //`address_id = ${addressId}`,
      acceptNull: false
    }
  ) 

  let commercialCocUrl = `https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/CommercialInspections/FeatureServer/0`
    let commercialCocData = useLayer(
      {
        url: commercialCocUrl,
        where: `address_id = ${clicked.type == "addresses" ? clicked.id : null}`,
        acceptNull: false
      }
    ) 
  
  let certificateOfOccupancyUrl = `https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/CertificateOfOccupancy/FeatureServer/0`
  let certificateOfOccupancyData = useLayer(
    {
      url: certificateOfOccupancyUrl,
      where: `address_id = ${clicked.type == "addresses" ? clicked.id : null}`,
      acceptNull: false
    }
  ) 

  let restaurantEstablishmentsUrl = `https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/Restaurant_Establishments/FeatureServer/0`
  let restaurantEstablishmentsData = useLayer(
    {
      url: restaurantEstablishmentsUrl,
      where: `address_id = ${clicked.type == "addresses" ? clicked.id : null}`,
      orderByFields: 'most_recent_license_date desc',
      acceptNull: false
    }
  ) 

  let restaurantInspectionsUrl = `https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/Restaurant_Inspections/FeatureServer/0`
  let restaurantInspectionsData = useLayer(
    {
      url: restaurantInspectionsUrl,
      where: `establishment_id = ${clicked.establishment_id ? clicked.establishment_id : null}`,
      orderByFields: 'inspection_date desc',
      acceptNull: false
    }
  ) 

  let restaurantViolationsUrl = `https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/Violations_Cited_per_Restaurant_Inspection/FeatureServer/0`
  let restaurantViolationsData = useLayer(
    {
      url: restaurantViolationsUrl,
      where: `establishment_id = ${clicked.establishment_id ? clicked.establishment_id : null}`,
      orderByFields: 'inspection_date desc',
      acceptNull: false
    }
  ) 

  function updateBusinessTruthData(datasetName, data, multiple=false){
    /**
     * Used to update the businessTruthData variable
     *
     * @param {string}   datasetName          dataset name, e.g. business_licenses
     * @param {Object or Array of Objects}   data        json of data (field_names: values). Can be an array of multiple json. Returned from AGO
     * @param {boolean} multiple false: set data using one json. true: set data using an array
     */
    if(data){
      console.log(datasetName)
      console.log(data)

      if(data.features.length > 0){
        let dataToSend = null
        if(multiple){
          dataToSend = data.features
        }
        else{
          dataToSend = data.features[0]
        }
        setBusinessTruthData(prevState => (
          {
            ...prevState,
            [datasetName]: dataToSend // need the [] to represent "computed property name". Otherwise, the key will be "datasetName"
          }
        ))

        // if restaurant_establishments, also set the establishment id
        if(datasetName == "restaurant_establishments"){
          setClicked(prevState => (
            {
              ...prevState,
              "establishment_id": dataToSend.attributes.establishment_id 
            }
          ))
        }
      }
      else{
        console.log(`No ${datasetName} data`)
        setBusinessTruthData(prevState => (
          {
            ...prevState,
            [datasetName]: null
          }
        ))
      }
    }
  }

  useEffect(() => {
    updateBusinessTruthData("business_licenses", businessLicensesData)
  }, [businessLicensesData])

  useEffect(() => {
    updateBusinessTruthData("commercial_coc", commercialCocData)
  }, [commercialCocData])

  useEffect(() => {
    updateBusinessTruthData("certificate_of_occupancy", certificateOfOccupancyData)
  }, [certificateOfOccupancyData])

  useEffect(() => {
    updateBusinessTruthData("restaurant_establishments", restaurantEstablishmentsData)
  }, [restaurantEstablishmentsData])

  useEffect(() => {
    updateBusinessTruthData("restaurant_inspections", restaurantInspectionsData)
  }, [restaurantInspectionsData])

  useEffect(() => {
    updateBusinessTruthData("restaurant_violations", restaurantViolationsData, true)
  }, [restaurantViolationsData])

  return (
    <>
      <AppHeader app={apps["business-truth"]} introduction={introduction} introOpen={false}>
        <ExplorerMapOptions {...{ options, setOptions, session, clicked }} />
      </AppHeader>

      {
        /** onDragEnd(result, businessTruthDisplayOrder, setBusinessTruthDisplayOrder)} */
      }
      <DragDropContext onDragEnd={result => onDragEnd(result, displayColumns, setDisplayColumns)} onDropEnd={result => console.log("DragDrop result: " + result)}>
        <SiteSidebar title="Explorer">
          {options.streetView && svImages.length === 0 && (
            <section className="">Loading street view imagery...</section>
          )}
          {options.streetView && svImages.length > 0 && (
            <MapillarySv {...{ svImage, svImages, setSvImage, setSvBearing, feature }} />
          )}

          <BusinessTruthSearch {...{ setClicked, setGeocoded, setBusinessTruthData }} />
        
          {/* Query for multiple datasets from AGO, and depending on the number, display that many BusinessTruthPanels */}
          {clicked.type === "addresses" && businessTruthData && (
            <Droppable droppableId="sidebar">
            {
              /*TODO: Will I need to add a width and height for this to work?*/
              (provided, snapshot) => {
                return (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                  {
                    //businessTruthDisplayOrder.map((datasetName, i) => {
                    displayColumns.sidebar.items.map((datasetName, i) => {
                      let currentDataset = businessTruthData[datasetName]
                      //if (currentDataset){
                        let d = new BusinessTruthDataset(datasetName, currentDataset)
                        return (
                          <Draggable key={datasetName} draggableId={datasetName} index={i}>
                            {
                              (provided, snapshot) => {
                                return(
                                  <div
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    ref={provided.innerRef}
                                  >
                                    <BusinessTruthFeature key={i} dataset={d} />
                                  </div>
                                )
                              }
                            }
                          </Draggable>
                        )
                      //}
                    })
                  }
                  { /*prevent boxes from collapsing together after moving one*/
                    provided.placeholder
                  }
                  </div>
                )
              }
            }
            </Droppable>
          )} 
          {clicked.type === "addresses" && feature && (
            <ExplorerAddress {...{ feature, clicked, setClicked, linked, setLinked }} />
          )}
          {clicked.type === "buildings" && feature && (
            <ExplorerBuilding {...{ feature, clicked, setClicked, linked, setLinked }} />
          )}
          {clicked.type === "parcels" && feature && (
            <ExplorerParcel {...{ feature, clicked, setClicked, linked, setLinked }} />
          )}
          {clicked.type === "streets" && feature && (
            <ExplorerStreet {...{ feature, clicked, setClicked, linked, setLinked }} />
          )}

          {(clicked.type || (geocoded && geocoded.features.length > 0)) && (
            <IssueReporter {...{ session, clicked, geocoded, feature }} />
          )}

          {geocoded && geocoded.features.length === 0 && geocoded.input && (
            <section className="sidebar-section">
              <p>
                We couldn't find any addresses which matched{" "}
                <strong className="">{geocoded.input}</strong>.
              </p>
              <p>If you think this address should exist, please report an issue here:</p>
              <IssueReporterAddress
                {...{ session, address: geocoded.input, unset: () => setGeocoded(null) }}
              />
            </section>
          )}

          {/* Link to, uh, Linker */}
          {feature && clicked.type === "addresses" && session && (
            <section className="sidebar-section caution">
              <Link href={`/linker?type=${clicked.type}&id=${clicked.id}`}>
                <FontAwesomeIcon icon={faLink} />
                <span className="text-semibold text-sm ml-2">Edit address links</span>
              </Link>
            </section>
          )}

        </SiteSidebar>

        {/* the main panel contains the map, and we pass it many of our useState variables */}
        <main>
          {/*TODO: need some sort of check for if the search if processing. e.g. pass a SetLoading
          If all businessTruthDisplayOrder keys are present, and the json is all empty, display
          */}
          <SimpleDialog title={"No Results"} message={"There was no business data for this address."} open={open} onClose={handleClose}/>
          <Droppable droppableId="main">
            {
              (provided, snapshot) => {
                return (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    <ExplorerMap
                      {...{
                        clicked,
                        setClicked,          
                        geocoded,
                        linked,
                        feature,
                        svImage,
                        setSvImages,
                        svBearing,
                        basemap: options.basemap,
                        showSv: options.streetView,
                      }}
                    />
                    {
                    //businessTruthDisplayOrder.map((datasetName, i) => {
                    displayColumns.main.items.map((datasetName, i) => {
                      let currentDataset = businessTruthData[datasetName]
                      //if (currentDataset){
                        let d = new BusinessTruthDataset(datasetName, currentDataset)
                        return (
                          <Draggable key={datasetName} draggableId={datasetName} index={i}>
                            {
                              (provided, snapshot) => {
                                return(
                                  <div
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    ref={provided.innerRef}
                                  >
                                    <BusinessTruthFeature key={i} dataset={d} />
                                  </div>
                                )
                              }
                            }
                          </Draggable>
                        )
                      //}
                    })
                  }
                  </div>
                )
              }
            }
          </Droppable>
        </main>
      </DragDropContext>
    </>
  );
};

export default BusinessPage;