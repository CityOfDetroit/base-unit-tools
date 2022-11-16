import {
  faChevronCircleDown,
  faChevronCircleRight,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AttributeTable from "../components/AttributeTable";
import CopyValue from "../components/CopyValue";
import CustomTooltip from "../components/CustomTooltip";
import businessTruthTypes from "../data/businessTruthTypes";
import { useState } from "react";
import AnimateHeight from "react-animate-height";
import Draggable from 'react-draggable';
import BusinessTruthMetadata from "./BusinessTruthMetadata";
import Pagination from '@mui/material/Pagination';

//const BusinessTruthFeature = ({ attr, attributes, longAttributes = {}, datasetType = null, metadata = null, fieldMetadata = null}) => {
const BusinessTruthFeature = ({ dataset }) => {
  // let hasSource = Object.keys(attr).indexOf('geo_source') > -1

  let style = dataset.style;

  const disabled = dataset.data ? false : true

  let [show, setShow] = useState(false);

  let [page, setPage] = useState(1);
  let maxPageCount = 5
  if(dataset.displayAttributes?.length){
    maxPageCount = Math.min(maxPageCount, dataset.displayAttributes.length)
  }
   // maximum number of pages to display is 5 or the array length

  const handlePageChange = (e, p) => {
    setPage(p);
  };

  const renderTable = () => {
    if(dataset.data){
      if(dataset.displayAttributes?.constructor?.name == "Array"){
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
      }
      return <AttributeTable attributes={dataset.displayAttributes} metadata={dataset.displayMetadata} />
    }
    return <p>No Data</p>
  }

  return (
      <div style={{
        opacity: disabled ? 0.5 : 1
      }}>
        <div
          id="business-truth-feature-header"
          className="bg-gray-300 p-2 text-xs font-bold flex items-center justify-between"
          style={{ borderLeft: `8px solid ${style.color}` }}
        >
          <div className="flex items-center">
            {/*Display the dataset name*/}
            {dataset.metadata.description
            ? <CustomTooltip title={dataset.metadata.description} placement="top">
                <h2 id="business-truth-feature-title" className="text-sm md:text-lg mr-3">{style.label}</h2>
              </CustomTooltip>
            : <h2 id="business-truth-feature-title" className="text-sm md:text-lg mr-3">{style.label}</h2>
            }
            {/*
            <a href={`/${style.singular}/${dataset.sourceAttributes[style.id_column]}`} target="_blank">
                <FontAwesomeIcon icon={faLink} className="ml-2 text-gray-400 hover:text-gray-500" />
            </a>
          */}
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={show ? faChevronCircleDown : faChevronCircleRight}
              className="mx-2 text-gray-500 text-xl"
              onClick={() => setShow(!show)}
            />
          </div>
        </div>
        {/*Display the dataset fields*/}
        <AnimateHeight duration={250} height={show ? "auto" : 0}>
          <section className="sidebar-section" style={{ borderLeft: `8px solid ${style.color}` }}>
            {/*
            Stores the fields
            Need to add something to determine if displayAttributes are arrays
            
            dataset.displayAttributes.constructor.name == "Array"
            ? 
            <div>
              <AttributeTable attributes={dataset.displayAttributes[page-1]} metadata={dataset.displayMetadata} />
              <Pagination count={maxPageCount} page={page} onChange={handlePageChange} />
            </div>
            : <AttributeTable attributes={dataset.displayAttributes} metadata={dataset.displayMetadata} />
            
            */}
            {
              renderTable()
            }
          </section>
        </AnimateHeight>
      </div>
  );
  //showFirstButton showLastButton: options for Pagination
  // TODO: may need to change the count for Pagination to the max number of values in the array
  // May also need to change Violations to query for the latest inspection. E.g. Capitol Park at 1405 Griswold has latest inspection from 2020, but latest violations from the establishment are 2019
  // TODO: link up restaurant data, like how the address points link up the base units
};

export default BusinessTruthFeature;
