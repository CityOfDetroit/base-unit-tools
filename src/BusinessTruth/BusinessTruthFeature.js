import {
  faChevronCircleDown,
  faChevronCircleRight,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AttributeTable from "../components/AttributeTable";
import CopyValue from "../components/CopyValue";
import businessTruthTypes from "../data/businessTruthTypes";
import { useState } from "react";
import AnimateHeight from "react-animate-height";
import CustomTooltip from "../components/CustomTooltip";
import BusinessTruthMetadata from "./BusinessTruthMetadata";

//const BusinessTruthFeature = ({ attr, attributes, longAttributes = {}, datasetType = null, metadata = null, fieldMetadata = null}) => {
const BusinessTruthFeature = ({ dataset }) => {
  // let hasSource = Object.keys(attr).indexOf('geo_source') > -1

  let style = dataset.style;

  let [show, setShow] = useState(false);

  return (
    <>
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
          <a href={`/${style.singular}/${dataset.sourceAttributes[style.id_column]}`} target="_blank">
              <FontAwesomeIcon icon={faLink} className="ml-2 text-gray-400 hover:text-gray-500" />
          </a>
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
          {/*Stores the fields*/}
          <AttributeTable attributes={dataset.displayAttributes} metadata={dataset.displayMetadata} />
          {/*Object.keys(longAttributes).length > 0 &&
            Object.keys(longAttributes).map((f, i) => (
              <div key={i} style={{ paddingLeft: 2 }}>
                <div
                  className={
                    i === 0
                      ? "border-t-2 border-gray-400 text-xs md:text-sm py-2 pr-2 flex items-center justify-between"
                      : "text-xs md:text-sm py-2 pr-2 flex items-center justify-between"
                  }
                >
                  <span className="font-bold">{f}</span>
                  <CopyValue
                    value={longAttributes[f]}
                    className="text-gray-300 hover:text-gray-400"
                  />
                </div>

                <p className="px-1 md:px-2 text-xs md:text-sm leading-4">{longAttributes[f]}</p>
              </div>
                ))*/}
        </section>
      </AnimateHeight>
    </>
  );
};

export default BusinessTruthFeature;
