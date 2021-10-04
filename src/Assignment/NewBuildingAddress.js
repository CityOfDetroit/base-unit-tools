import { faAddressBook } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import Button from '../components/Button';
import layers from '../data/layers';
import AssignmentBuilding from './AssignmentBuilding';
import AssignmentParcel from './AssignmentParcel';
import useFeature from '../hooks/useFeature';
import { addFeatures } from '@esri/arcgis-rest-feature-layer';

const handleSubmit = (data, session, certNumber) => {
  let integromatBody = {
    "addresses": data,
    "list_of_addresses": data.map(ad => ad.full_address).join("\n"),
    "certificate_number": certNumber,
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
      geometry: null,
      attributes: ad
    }
  })

  addFeatures({
    url: `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/address_assignments/FeatureServer/0`,
    features: esriFeatures,
    authentication: session
  }).then(r => console.log(r))
}

const NewAddressToSubmit = ({ modelAddress, building, street, session, certNumber }) => {
  let [houseNumber, setHouseNumber] = useState(modelAddress.attributes.street_number)
  let streetFeature = useFeature({ type: 'streets', id: street })
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

  let toSubmit = []
  let buttonText = null
  if (newUnits.length > 0) {
    toSubmit = newUnits.map(nu => {
      return {
        street_number: houseNumber,
        street_id: street,
        building_id: building,
        parcel_id: modelAddress.attributes.parcel_id,
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
      parcel_id: modelAddress.attributes.parcel_id,
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
        parcel_id: modelAddress.attributes.parcel_id,
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
    <section className='sidebar-section'>
      <h3>New address links</h3>
      <div className="flex items-center justify-between">
        <div>Building ID</div>
        <input type="text" className="px-3 py-2 m-2" value={building} readOnly={true} disabled={true} />
      </div>
      <div className="flex items-center justify-between">
        <div>Street ID</div>
        <input type="text" className="px-3 py-2 m-2" value={street} readOnly={true} disabled={true} />
      </div>
      <h3>New address attributes</h3>
      <div className="flex items-center justify-between">
        <div>House number:</div>
        <input type="text" className="px-3 py-2 m-2" value={houseNumber} onChange={e => setHouseNumber(e.target.value)} />
      </div>
      <div className="flex items-center justify-between">
        <div>Street name:</div>
        <input type="text" className="px-3 py-2 m-2" value={fullStreetName} disabled={true} />
      </div>
      <div className="flex items-center justify-between">
        <div>Unit type:</div>
        <select type="text" className="px-3 py-2 m-2" value={unitType} onChange={(e) => setUnitType(e.target.value)}>
          {unitTypes.map(ut => <option value={ut} key={ut}>{ut}</option>)}
        </select>
      </div>
      <div className="flex items-center justify-between">
        <div>Unit number:</div>
        <textarea className="px-3 py-2 m-2" value={unitNums} rows={8} type="text" onChange={(e) => setUnitNums(e.target.value)} />
      </div>
      <div className="flex items-center justify-between">
        <div>Notes:</div>
        <textarea className="px-3 py-2 m-2" value={notes} rows={4} type="text" onChange={(e) => setNotes(e.target.value)} />
      </div>
      {toSubmit.length > 0 && <Button icon={faAddressBook} onClick={() => handleSubmit(toSubmit, session, certNumber)}>Submit {buttonText} address(es)</Button>}
    </section>
  )
}

const NewBuildingAddress = ({ building, setBuilding, street, setStreet, setSelectableLayers, session, certNumber }) => {

  let [modelAddress, setModelAddress] = useState(null)

  useEffect(() => {
    if (building != '') {
      setSelectableLayers([layers.buildings.interaction, layers.streets.interaction])
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
          {modelAddress && <NewAddressToSubmit {...{ modelAddress, building, street, session, certNumber }} />}
        </>
      }

    </>
  )

}

export default NewBuildingAddress;