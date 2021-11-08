import { faAddressBook, faAddressCard, faCheckSquare, faLink, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import Button from '../components/Button';
import layers from '../data/layers';
import AssignmentBuilding from './AssignmentBuilding';
import AssignmentParcel from './AssignmentParcel';
import useFeature from '../hooks/useFeature';
import { addFeatures } from '@esri/arcgis-rest-feature-layer';
import { UserSession } from '@esri/arcgis-rest-auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormInput from '../components/FormInput';
import FormField from '../components/FormField';
import FormRow from '../components/FormRow';
import SectionSubhead from '../components/SectionSubhead';

/**
 * On form submission, send data to Slack, via Integromat, and add new features to ArcGIS Online.
 * @param {object} data 
 * @param {UserSession} session 
 */
const handleSubmit = (data, session, setSubmitted, geometry) => {
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
    return {
      geometry: geometry,
      attributes: ad
    }
  })

  addFeatures({
    url: `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/address_assignments/FeatureServer/0`,
    features: esriFeatures,
    authentication: session
  }).then(r => setSubmitted(r))
}

const NewAddressToSubmit = ({ modelAddress, building, street, parcel, session }) => {
  let [houseNumber, setHouseNumber] = useState(modelAddress.attributes.street_number)
  let streetFeature = useFeature({ type: 'streets', id: street })
  let buildingFeature = useFeature({ type: 'buildings', id: building })
  let { street_prefix, street_name, street_type } = streetFeature.attributes
  let fullStreetName = [street_prefix, street_name, street_type].join(" ").trim()

  let unitTypes = [
    '', 'Apt', 'Ste', 'Upper', 'Lower'
  ]
  let [unitType, setUnitType] = useState(unitTypes[0])

  // store the current unit number state..
  let [unitNums, setUnitNums] = useState('')
  // ..& split lines into an array
  let newUnits = unitNums.split("\n").filter(a => a !== "")

  let [addrsToAdd, setAddrsToAdd] = useState([])
  let [notes, setNotes] = useState('')
  let [certNumber, setCertNumber] = useState('')

  let [submitted, setSubmitted] = useState(false)

  let toSubmit = []
  let buttonText = null
  if (newUnits.length > 0) {
    toSubmit = newUnits.map(nu => {
      return {
        street_number: houseNumber,
        street_id: street,
        building_id: building,
        parcel_id: parcel,
        unit_type: unitType,
        unit_number: nu,
        certificate_number: certNumber,
        full_address: `${houseNumber} ${fullStreetName} ${unitType} ${nu}`.trim(),
        notes: notes
      }
    })
    buttonText = `${toSubmit.length} new unit`
  }
  if (unitType === 'Upper' || unitType === 'Lower') {
    toSubmit = [{
      street_number: houseNumber,
      street_id: street,
      building_id: building,
      parcel_id: parcel,
      unit_type: unitType,
      unit_number: null,
      certificate_number: certNumber,
      full_address: `${houseNumber} ${fullStreetName} ${unitType}`.trim(),
      notes: notes
    }]
    buttonText = `${toSubmit.length} new unit`
  }
  if (newUnits.length === 0 && houseNumber != modelAddress.attributes.street_number) {
    toSubmit = [
      {
        street_number: houseNumber,
        street_id: street,
        building_id: building,
        parcel_id: parcel,
        unit_type: null,
        unit_number: null,
        certificate_number: certNumber,
        full_address: `${houseNumber} ${fullStreetName}`.trim(),
        notes: notes
      }
    ]
    buttonText = `1 new primary`
  }

  useEffect(() => {
    setHouseNumber(modelAddress.attributes.street_number)
    setUnitType('')
    setUnitNums('')
  }, [modelAddress])

  return (
    <>
      <h2 className="bg-gray-300 p-2 mt-2 text-base">Creating new addresses:</h2>

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

        <SectionSubhead 
          title="Addresses to create here"
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
          <FormField title="Unit number: enter one per line" width="2/3">
            <textarea className="py-2 px-3 text-xs" value={unitNums} rows={6} type="text" onChange={(e) => setUnitNums(e.target.value)} />
          </FormField>
        </FormRow>

        <FormRow>
          <FormField title="Additional notes:" width="full">
            <textarea className="px-3 py-2 text-sm" value={notes} rows={2} type="text" onChange={(e) => setNotes(e.target.value)} />
          </FormField>
        </FormRow>

        <div className="flex items-center justify-around">
          {toSubmit.length > 0 && !submitted &&
            <Button 
              className="w-2/3 mx-4 justify-around my-5 p-4"
              icon={faPlusCircle}
              onClick={() => handleSubmit(toSubmit, session, setSubmitted, buildingFeature.geometry)}
            >
              Submit {buttonText} address(es)
            </Button>
          }
          {
            submitted &&
            <Button
              onClick={() => { setSubmitted(false); setHouseNumber(''); setUnitType(unitTypes[0]); setUnitNums(''); setNotes('')}}
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

const NewBuildingAddress = ({ building, setBuilding, street, setStreet, parcel, setParcel, setSelectableLayers, session, setSubmitted }) => {

  let [modelAddress, setModelAddress] = useState(null)

  let [open, setOpen] = useState(false)

  useEffect(() => {
    if (building != '') {
      setSelectableLayers([layers.buildings.interaction, layers.streets.interaction, layers.parcels.interaction])
    }
    if (building == '') {
      setSelectableLayers([layers.buildings.interaction])
    }
  }, [building])

  return (
    <>
      {!building && <section className='sidebar-section'>
        <h2><b>Click the building</b> the new address belongs to.</h2>
      </section>}
      {building &&
        <>

          <AssignmentBuilding {...{ building, setModelAddress, setStreet }} />

          {modelAddress && modelAddress.attributes.parcel_id && <AssignmentParcel parcel={modelAddress.attributes.parcel_id} />}

          {modelAddress && <NewAddressToSubmit {...{ modelAddress, building, street, parcel, session }} />}
        </>
      }

    </>
  )

}

export default NewBuildingAddress;