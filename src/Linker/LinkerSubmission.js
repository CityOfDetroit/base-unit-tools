import { faWrench } from '@fortawesome/free-solid-svg-icons';
import React, {useState} from 'react';
import { Link } from "react-router-dom";
import Button from '../components/Button';
import {addFeatures} from '@esri/arcgis-rest-feature-layer'

const addFeature = ({ session, formText, x, y, targetId, setAddResponse, links }) => {

  addFeatures({
    url: "https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/address_issues/FeatureServer/0",
    features: [{
      geometry: { x: x, y: y, spatialReference: { wkid: 4326 } },
      attributes: {
        target_unit: 'address',
        issue_type: 'update_link',
        target_id: targetId ? targetId.toString() : null,
        id_parcel: links.parcel_id,
        id_building: links.bldg_id,
        id_street: links.street_id,
        notes: formText
      }
    }],
    authentication: session ? session : null
  })
    .then(d => setAddResponse(d))
}

const LinkerSubmission = ({ session, feature, links }) => {

  let [formText, setFormText] = useState('')
  let [sent, setSent] = useState(false)
  let [addResponse, setAddResponse] = useState(null)
  console.log(links)
  return (
    <section className="sidebar-section">
    <div className="flex items-center justify-between">

      <h2>Notes</h2>
      {formText.length > 200 && <span className="text-sm text-gray-600">{255 - formText.length} chars remaining</span> }
    </div>
    <textarea type="text" cols="35" rows="8" maxLength="255" className="p-2 m-1" value={formText} onChange={(e) => { setFormText(e.target.value); setSent(false) }}></textarea>
    <Button
      text={`Submit`}
      icon={faWrench}
      onClick={() => {
        addFeature({
          session: session,
          formText: formText,
          x: feature.geometry.coordinates[0],
          y: feature.geometry.coordinates[1],
          targetId: feature.properties.addr_id,
          setAddResponse: setAddResponse,
          links: links
        });
        setSent(true);
      }}
    />
  {
    addResponse && addResponse.addResults[0].success &&
    <section className="sidebar-section">
      Thanks for your input! <Link to={`/explorer?type=addresses&id=${feature.properties.addr_id}`}>Jump back to the explorer</Link>
    </section>
  }
  </section>
  )
}

export default LinkerSubmission;