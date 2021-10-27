import { faAddressBook, faAddressCard, faLink, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import Button from '../components/Button';
import layers from '../data/layers';
import AssignmentBuilding from './AssignmentBuilding';
import AssignmentParcel from './AssignmentParcel';
import useFeature from '../hooks/useFeature';
import { addFeatures } from '@esri/arcgis-rest-feature-layer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    <>
      <h2 className="bg-gray-300 p-2 mt-2 text-base">Creating new addresses:</h2>
      <section className='sidebar-section border-b-2'>
        <div className="flex justify-start items-center my-2">
          <FontAwesomeIcon icon={faLink} className="mr-3 text-xl" />
          <div>
            <h3 className="text-base font-semibold text-gray-700">Links to other base units</h3>
            <h3 className="text-sm font-normal text-gray-700">Adjust these by clicking the map</h3>
          </div>
        </div>
        <div className="flex justify-start mb-4 px-1">
          <div className="flex flex-col w-1/3 pr-3">
            <span className="text-sm font-semibold py-1">Building ID</span>
            <input type="text" className="p-2 text-sm font-mono" value={building} readOnly={true} disabled={true} />
          </div>
          <div className="flex flex-col w-1/3 pr-3">
            <span className="text-sm font-semibold py-1">Street ID</span>
            <input type="text" className="p-2 text-sm font-mono" value={street} readOnly={true} disabled={true} />
          </div>
          <div className="flex flex-col w-1/3 pr-3">
            <span className="text-sm font-semibold py-1">Parcel ID</span>
            <input type="text" className="p-2 text-sm font-mono" value={modelAddress.attributes.parcel_id} readOnly={true} disabled={true} />
          </div>
        </div>


        <div className="flex justify-start items-center my-2">
          <FontAwesomeIcon icon={faAddressCard} className="mr-3 text-xl" />
          <div>
            <h3 className="text-base font-semibold text-gray-700">Addresses to create here</h3>
          </div>
        </div>

        <div className="flex justify-start mb-3 px-1">
          <div className="flex flex-col w-1/3 pr-3">
            <span className="text-sm font-semibold py-1">House number</span>
            <input type="text" className="p-2 text-sm" value={houseNumber} onChange={e => setHouseNumber(e.target.value)} />
          </div>
          <div className="flex flex-col w-2/3 pr-3">
            <span className="text-sm font-semibold py-1">Street name</span>
            <input type="text" className="p-2 text-sm" value={fullStreetName} disabled={true} />
          </div>
        </div>


        <div className="flex items-baseline justify-between">
          <div className="flex flex-col w-1/3 pr-3">
            <span className="text-sm font-semibold py-1">Unit type</span>
            <select type="text" className="p-2 text-sm" value={unitType} onChange={(e) => setUnitType(e.target.value)}>
              {unitTypes.map(ut => <option value={ut} key={ut}>{ut}</option>)}
            </select>
          </div>
          <div className="flex flex-col w-2/3 pr-3">
            <span className="text-sm font-semibold py-1">Unit number: enter one per line</span>
            <span className="text-xs font-semibold pb-1">Enter one unit number per line</span>
            <textarea className="py-2 px-3 text-xs" value={unitNums} rows={6} type="text" onChange={(e) => setUnitNums(e.target.value)} />
          </div>
        </div>

        <div className="flex items-baseline justify-between">
        <div className="flex flex-col w-full pr-3">
          <span className="text-sm font-semibold py-1">Additional notes</span>
          <textarea className="px-3 py-2 text-sm" value={notes} rows={2} type="text" onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>
        <div className="flex items-center justify-around">

        {toSubmit.length > 0 && <Button className="w-2/3 mx-4 justify-around my-5 p-4" onClick={() => handleSubmit(toSubmit, session, certNumber)}>Submit {buttonText} address(es)</Button>}
        </div>
      </section>
    </>
  )
}

const NewBuildingAddress = ({ building, setBuilding, street, setStreet, setSelectableLayers, session, certNumber }) => {

  let [modelAddress, setModelAddress] = useState(null)

  let [open, setOpen] = useState(false)

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