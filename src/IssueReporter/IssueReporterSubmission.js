import { faWrench } from '@fortawesome/free-solid-svg-icons';
import React, {useState} from 'react';
import { Link } from "react-router-dom";
import Button from '../components/Button';
import {addFeatures} from '@esri/arcgis-rest-feature-layer'

const addFeature = ({ session, formText, address, x, y, targetType, targetId, setAddResponse }) => {

  addFeatures({
    url: "https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/address_issues/FeatureServer/0",
    features: [{
      geometry: { x: x, y: y, spatialReference: { wkid: 4326 } },
      attributes: {
        address_string: address,
        target_unit: targetType,
        target_id: targetId ? targetId.toString() : null,
        notes: formText
      }
    }],
    authentication: session ? session : null
  })
    .then(d => setAddResponse(d))
}

const IssueReporterSubmission = ({ value, target, session, targetType, featureCentroid }) => {

  let [formText, setFormText] = useState('')
  let [sent, setSent] = useState(false)
  let [addResponse, setAddResponse] = useState(null)

  return (
    <section className="sidebar-section">
    <div className="flex items-center justify-between">

      <h2>What is the issue?</h2>
      {formText.length > 200 && <span className="text-sm text-gray-600">{255 - formText.length} chars remaining</span> }
    </div>
    <textarea type="text" cols="35" rows="8" maxLength="255" className="p-2 m-1" value={formText} onChange={(e) => { setFormText(e.target.value); setSent(false) }}></textarea>
    <Button
      active={formText !== '' && !sent}
      disabled={formText === ''}
      text={`Submit`}
      icon={faWrench}
      onClick={() => {
        addFeature({
          session: session,
          formText: formText,
          address: targetType === 'address' ? value : null,
          x: featureCentroid[1],
          y: featureCentroid[0],
          targetType: targetType === 'base_unit' ? target.type.replaceAll(/[es]$/g, '') : null,
          targetId: targetType === 'base_unit' ? target.id : null,
          setAddResponse: setAddResponse
        });
        setSent(true);
      }}
    />
  {
    addResponse && addResponse.addResults[0].success &&
    <section className="sidebar-section">
      Thanks for your input! <Link to={`/explorer?type=${target.type}&id=${target.id}`}>Jump back to the explorer</Link>
    </section>
  }
  </section>
  )
}

export default IssueReporterSubmission;