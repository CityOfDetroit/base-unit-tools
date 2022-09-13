import AnimateHeight from "react-animate-height";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleDown,
  faChevronCircleRight,
  faExclamationTriangle,
  faEnvelope,
  faEnvelopeSquare,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';
import Button from "./Button";
import { addFeatures } from "@esri/arcgis-rest-feature-layer";
import layers from "../data/layers";
import { arcgisToGeoJSON } from "@esri/arcgis-to-geojson-utils";
import centroid from "@turf/centroid";

const addFeature = ({
  session,
  formText,
  address,
  x,
  y,
  targetType,
  targetId,
  emailAddress,
  setAddResponse,
  unset
}) => {
  addFeatures({
    url: "https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/issue_reporter/FeatureServer/0",
    features: [
      {
        geometry: { x: x, y: y, spatialReference: { wkid: 4326 } },
        attributes: {
          address: address,
          feature_type: targetType,
          feature_id: targetId,
          email: emailAddress,
          issue: formText,
        },
      },
    ],
    authentication: session ? session : null,
  }).then((d) => {setAddResponse(d); unset();});
};

const IssueReporterAddress = ({ session, address='123 Fake St', title="Report an issue", unset }) => {

  // need these for the form
  let [formText, setFormText] = useState("");
  let [sent, setSent] = useState(false);
  let [addResponse, setAddResponse] = useState(null);
  let [email, setEmail] = useState("");

  return (
    <section className="bg-gray-300 p-2 md:p-3 mt-2">
      <div
        className="flex items-center justify-between"
      >
        <div
          className={
              `text-gray-800 flex items-center justify-around`
          }
        >
          <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
          <h3 className="text-sm md:text-base">{title}</h3>
        </div>
        <FontAwesomeIcon
          icon={faWindowClose}
          onClick={unset}
          className="mx-1 text-xl text-gray-500"
        />
      </div>
      <AnimateHeight duration={250} height={"auto"}>
        <div className="p-2 my-2 text-sm md:text-base">
          <div className="flex items-center gap-2">
            <input
              value={`No geocoder match`}
              disabled
              type="text"
              className="p-2 my-1 w-1/2"
            />
          </div>
          <input
            value={address}
            disabled
            type="text"
            className="p-2 w-full"
          />


          <p className="py-2">Describe the issue:</p>
          <textarea
            type="text"
            maxLength="255"
            className="w-11/12 h-40 p-2"
            value={formText}
            onChange={(e) => {
              setFormText(e.target.value);
              setSent(false);
            }}
          />
          {!session && (
            <>
              <p className="py-2">Your e-mail address:</p>
              <input
                type="text"
                className="p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </>
          )}
        </div>
        <div className="flex items-center justify-around">
          {!addResponse && <Button
            active={formText !== "" && !sent}
            disabled={formText === ""}
            text={`Submit`}
            small
            icon={faEnvelope}
            className="w-2/3 flex items-center justify-center"
            onClick={() => {
              addFeature({
                session: session,
                formText: formText,
                address: address,
                emailAddress: session ? null : email,
                setAddResponse: setAddResponse,
                unset: unset
              });
              setSent(true);
            }}
          />}
        </div>
        {addResponse && addResponse.addResults[0].success && (
          <Button
            icon={faWindowClose}
            small
            className="mx-auto"
            text={`Thanks for reporting this issue!`}
            onClick={() => {
              setAddResponse(null);
              setFormText("");
            }}
            />
        )}
      </AnimateHeight>
    </section>
  );
};

export default IssueReporterAddress;
