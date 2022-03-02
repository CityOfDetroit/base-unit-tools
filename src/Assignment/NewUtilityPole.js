import { faAddressCard, faCheckSquare, faLink, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Button from '../components/Button';
import FormField from '../components/FormField';
import FormInput from '../components/FormInput';
import FormRow from '../components/FormRow';
import SectionSubhead from '../components/SectionSubhead';
import useFeature from '../hooks/useFeature';
import AssignmentStreet from "./AssignmentStreet";
import { addFeatures } from '@esri/arcgis-rest-feature-layer';

/**
 * On form submission, send data to Slack, via Integromat, and add new features to ArcGIS Online.
 * @param {object} data 
 * @param {UserSession} session 
 */
const handleSubmit = (data, lngLat, session, setSubmitted) => {
  let integromatBody = {
    "addresses": data,
    "list_of_addresses": data.map(ad => ad.full_address).join("\n"),
    "certificate_number": data.certificate_number,
    "creator": session.username,
  }

  fetch(`https://hook.integromat.com/fgu9lrjc6ps43fdk8s7tdat9ylv20uqg`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(integromatBody)
  })
    .then(d => console.log(d))

  let esriFeatures = data.map(ad => {
    ad['scenario'] = 'NewUtilityPole'

    return {
      geometry: { x: lngLat.lng, y: lngLat.lat, spatialReference: { wkid: 4326 } },
      attributes: ad
    }
  })

  addFeatures({
    url: `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/address_assignments/FeatureServer/0`,
    features: esriFeatures,
    authentication: session
  }).then(r => {
    setSubmitted(r)
  })
}

const NewAddressToSubmit = ({ street, lngLat, session }) => {
  let [houseNumber, setHouseNumber] = useState('')
  let streetFeature = useFeature({ type: 'streets', id: street })
  let { street_prefix, street_name, street_type } = streetFeature ? streetFeature.attributes : {}
  let fullStreetName = [street_prefix, street_name, street_type].join(" ").trim()

  let [notes, setNotes] = useState('')
  let [certNumber, setCertNumber] = useState('')
  let [submitted, setSubmitted] = useState(false)

  let toSubmit = [{
    street_number: houseNumber,
    street_id: street,
    certificate_number: certNumber,
    full_address: `${houseNumber} ${fullStreetName}`.trim(),
    notes: notes
  }]

  return (
    <>
      <h2 className="bg-gray-300 p-2 mt-2 text-base">Creating new utility pole address:</h2>
      <section className="sidebar-section border-b-2">
        <FormField title="DPW House Number Certificate" width="3/5">
          <input type='text' className="px-3 py-2" value={certNumber} onChange={(e) => setCertNumber(e.target.value)}></input>
        </FormField>

        <SectionSubhead
          title="Links to other base units"
          subtitle="Adjust these by clicking the map"
          icon={faLink}
        />

        <FormRow>
          {/* <FormInput title="Building ID" value={building} readOnly disabled /> */}
          <FormInput title="Street ID" value={street} readOnly disabled />
          {/* <FormInput title="Parcel ID" value={parcel} readOnly disabled /> */}
        </FormRow>

        <SectionSubhead
          title="Addresses to create here"
          icon={faAddressCard}
        />

        <FormRow>
          <FormInput title="House number" value={houseNumber} onChange={e => setHouseNumber(e.target.value)} />
          <FormInput title="Street name" value={fullStreetName} disabled width="2/3" />
        </FormRow>

        <FormRow>
          <FormField title="Additional notes:" width="full">
            <textarea className="px-3 py-2 text-sm" value={notes} rows={2} type="text" onChange={(e) => setNotes(e.target.value)} />
          </FormField>
        </FormRow>

        {houseNumber === '' && <h3 className="warning p-2 text-sm">You must enter a valid house number.</h3>}
        <div className="flex items-center justify-around">
          {!submitted && <Button
            className="mx-4 justify-around my-5 p-4"
            onClick={() => handleSubmit(toSubmit, lngLat, session, setSubmitted)}
            icon={faPlusCircle}
            disabled={houseNumber === ''}
          >
            Submit address
          </Button>}
          {
            submitted &&
            <Button
              onClick={() => { setSubmitted(false); setHouseNumber(''); }}
              icon={faCheckSquare}
            >
              Success! Click to reset form.
            </Button>
          }
        </div>
      </section>
    </>
  )
}

const NewUtilityPole = ({ street, setStreet, session, addresses, setAddresses, lngLat, setLngLat }) => {
  console.log(street)
  return (
    <>
      {!street && <section className='sidebar-section'>
        <h2>Click a street segment for the new utility address.</h2>
      </section>}
      {street && street !== '' && <AssignmentStreet {...{ street, addresses, setAddresses }} />}
      {street && <section className='sidebar-section'>
        <h2 className="p-1 my-1">Adjust the location <span class="dot" style={{ height: 20, width: 20, border: `2px solid #ddd`, background: `rgba(120,0,0,0.5)`, borderRadius: `50%`, display: `inline-block`, marginBottom: -3, marginLeft: 5, marginRight: 5 }}></span> of the new utility pole address by clicking the map.</h2>
      </section>}
      {lngLat && <NewAddressToSubmit {...{ street, lngLat, session }} />}
    </>
  )
}

export default NewUtilityPole;