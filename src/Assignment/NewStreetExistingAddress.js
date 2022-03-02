import { faAddressCard, faLink, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import Button from '../components/Button';
import FormField from '../components/FormField';
import FormInput from '../components/FormInput';
import FormRow from '../components/FormRow';
import SectionSubhead from '../components/SectionSubhead';
import useFeature from '../hooks/useFeature';
import AssignmentStreet from "./AssignmentStreet";
import AssignmentParcel from './AssignmentParcel';
import { addFeatures } from '@esri/arcgis-rest-feature-layer';
import layers from '../data/layers';

/**
 * On form submission, send data to Slack, via Integromat, and add new features to ArcGIS Online.
 * @param {object} data 
 * @param {UserSession} session 
 */
const handleSubmit = (data, lngLat, session) => {
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
    ad['scenario'] = 'NewStreetExistingAddress'
    return {
      geometry: { x: lngLat.lng, y: lngLat.lat, spatialReference: { wkid: 4326 } },
      attributes: ad
    }
  })

  addFeatures({
    url: `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/address_assignments/FeatureServer/0`,
    features: esriFeatures,
    authentication: session
  }).then(r => console.log(r))
}

const NewAddressToSubmit = ({ parcel, modelAddress, setParcel, building, street, lngLat, session }) => {
  let [houseNumber, setHouseNumber] = useState('')
  let streetFeature = useFeature({ type: 'streets', id: street })
  let { street_prefix, street_name, street_type } = streetFeature.attributes
  let fullStreetName = [street_prefix, street_name, street_type].join(" ").trim()
  let [newParcelId, setNewParcelId] = useState('')

  let [notes, setNotes] = useState('')
  let [certNumber, setCertNumber] = useState('')

  let unitTypes = [
    '', 'Apt', 'Ste', 'Upper', 'Lower'
  ]
  let [unitType, setUnitType] = useState(unitTypes[0])
  let [unitNum, setUnitNum] = useState('')

  let toSubmit = [{
    street_number: houseNumber,
    street_id: street,
    certificate_number: certNumber,
    unit_type: unitType !== '' ? unitType: null,
    unit_number: unitNum !== '' ? unitNum: null,
    full_address: `${houseNumber} ${fullStreetName}`.trim(),
    notes: notes
  }]

  useEffect(() => {
    setHouseNumber(modelAddress.attributes.street_number)
    setUnitNum(modelAddress.attributes.unit_number)
    setUnitType(modelAddress.attributes.unit_type)
  }, [modelAddress])

  let a = modelAddress.attributes

  return (
    <>
      <h2 className="bg-gray-300 p-2 mt-2 text-base">Reassigning {[a.street_number, a.street_prefix, a.street_name, a.street_type, a.unit_type, a.unit_number].join(' ')}</h2>
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
          <FormInput title="Building ID" value={building} readOnly disabled />
          <FormInput title="Street ID" value={street} readOnly disabled />
          <FormInput title="Parcel ID" value={parcel} readOnly disabled />
        </FormRow>

        {/* <FormRow>
          <FormInput title="New Parcel ID" value={newParcelId} onChange={(e) => setNewParcelId(e.target.value)} />
        </FormRow> */}

        <SectionSubhead
          title="Address with new street assignment"
          icon={faAddressCard}
        />

        <FormRow>
          <FormInput title="House number" value={houseNumber} onChange={e => setHouseNumber(e.target.value)} />
          <FormInput title="Street name" value={fullStreetName} disabled width="2/3" />
        </FormRow>

        <FormRow>
          <FormField title="Unit type" width="1/3">
            <select type="text" className="p-2 text-sm" value={unitType} onChange={(e) => setUnitType(e.target.value)}>
              {unitTypes.map(ut => <option value={ut} key={ut}>{ut}</option>)}
            </select>
          </FormField>
          <FormInput title="Unit number" width="2/3" value={unitNum} onChange={e => setUnitNum(e.target.value)} />
        </FormRow>

        <FormRow>
          <FormField title="Additional notes:" width="full">
            <textarea className="px-3 py-2 text-sm" value={notes} rows={2} type="text" onChange={(e) => setNotes(e.target.value)} />
          </FormField>
        </FormRow>

        {houseNumber === '' && <h3 className="warning p-2 text-sm">You must enter a valid house number.</h3>}
        <div className="flex items-center justify-around">
          <Button
            className="mx-4 justify-around my-5 p-4"
            onClick={() => handleSubmit(toSubmit, lngLat, session)}
            icon={faPlusCircle}
          >
            Submit address
          </Button>
        </div>
      </section>
    </>
  )
}
const NewStreetExistingAddress = ({ street, setStreet, parcel, building, setBuilding, setParcel, session, addresses, setAddresses, lngLat, setSelectableLayers }) => {

  let [modelAddress, setModelAddress] = useState(null)

  useEffect(() => {
    if (parcel != '') {
      setSelectableLayers([layers.streets.interaction, layers.parcels.interaction])
    }
    if (parcel == '') {
      setSelectableLayers([layers.parcels.interaction])
    }
  }, [parcel])

  return (
    <>
      {!parcel && <section className='sidebar-section'>
        <h2>Select the parcel that contains the address you want to reassign.</h2>
      </section>}

      {parcel && <AssignmentParcel {...{ parcel, setAddresses, setModelAddress, setStreet, setBuilding }} />}

      {addresses.length > 1 && 
        <section className='mt-2 p-2 bg-yellow-100'>
        <h2>This parcel has more than one address; please choose one for reassignment:</h2>
        <select className="p-2 m-2" onChange={(e) => setModelAddress({attributes: addresses[e.target.value]})}>
          {addresses.map((a, i) => (
            <option value={i}>{[a.street_number, a.street_prefix, a.street_name, a.street_type, a.unit_type, a.unit_number].join(' ')} [ #{a.addr_id} ]</option>
          ))}
        </select>
        </section>
      }

      {parcel && modelAddress && <NewAddressToSubmit {...{ street, parcel, setParcel, building, modelAddress, session }} />}

    </>
  )
}

export default NewStreetExistingAddress;