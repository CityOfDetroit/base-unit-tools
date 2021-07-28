import useFeature from '../hooks/useFeature';
import ExplorerFeature from '../Explorer/ExplorerFeature';
import AddressesHere from '../Explorer/AddressesHere';
import IdBadge from '../Explorer/IdBadge';
import layers from '../data/layers';
import { useState, useEffect } from 'react';
import types from '../data/building_types.json'
import Button from '../components/Button';
import { faAddressBook } from '@fortawesome/free-solid-svg-icons';
import { addFeatures } from '@esri/arcgis-rest-feature-layer'


const AssignmentBuilding = ({ building, setStreet, setModelAddress }) => {

  let feature = useFeature({
    type: 'buildings',
    id: building,
    f: 'geojson'
  })

  let [addresses, setAddresses] = useState([])

  useEffect(() => {
    let url = layers.addresses.endpoint + `/query?`
    let params = {
      where: `bldg_id = ${building} AND unit_type is null AND unit_number is null`,
      outFields: `*`,
      outSR: 4326,
      f: `pjson`
    }
    let queryString = Object.keys(params).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
    }).join('&');
    fetch(url + queryString)
      .then(r => r.json())
      .then(d => {
        if (Object.keys(d).indexOf('features') > -1) {
          if (d.features.length > 0) {
            setAddresses(d.features.map(f => f.attributes))
            setModelAddress(d.features[0])
            setStreet(d.features[0].attributes.street_id)
          }
          else {
            setAddresses([])
          }
        }
      })

  }, [building])

  let attributes;
  let clicked = { type: 'buildings', id: building }
  if (feature) {
    attributes = {
      "Use type": feature.properties.use_category,
      "Building type": feature.properties.ted_build_type
    }
  }

  return (
    <>
      {feature && <ExplorerFeature {...{ attr: feature.properties, attributes, clicked: clicked }} />}
      {addresses.length > 0 && <AddressesHere {...{ addresses, title: "primary" }} />}
    </>
  )
}

const handleSubmit = (data) => {

  fetch(`https://hook.integromat.com/fgu9lrjc6ps43fdk8s7tdat9ylv20uqg`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(data)
  })
    .then(d => console.log(d))
}

const NewAddressToSubmit = ({ modelAddress, building, street }) => {
  let [houseNumber, setHouseNumber] = useState(modelAddress.attributes.street_number)
  let streetFeature = useFeature({ type: 'streets', id: street })
  let { street_prefix, street_name, street_type } = streetFeature.attributes
  let fullStreetName = [street_prefix, street_name, street_type].join(" ").trim()

  let unitTypes = [
    '', 'Apt', 'Ste', 'Upper', 'Lower'
  ]
  let [unitType, setUnitType] = useState(unitTypes[0])
  let [unitNums, setUnitNums] = useState('')
  let [addrsToAdd, setAddrsToAdd] = useState([])
  let newUnits = unitNums.split("\n").filter(a => a !== "")

  let toSubmit = []
  let buttonText = null
  if (newUnits.length > 0) {
    toSubmit = newUnits.map(nu => {
      return {
        house_number: houseNumber,
        street_id: street,
        building_id: building,
        unit_type: unitType,
        unit_number: nu
      }
    })
    buttonText = `${toSubmit.length} new unit`
  }
  if (unitType === 'Upper' || unitType === 'Lower') {
    toSubmit = [{
      house_number: houseNumber,
      street_id: street,
      building_id: building,
      unit_type: unitType
    }]
    buttonText = `${toSubmit.length} new unit`
  }
  if (newUnits.length === 0 && houseNumber != modelAddress.attributes.street_number) {
    toSubmit = [
      {
        house_number: houseNumber,
        street_id: street,
        building_id: building,
        unit_type: null,
        unit_number: null
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
          {unitTypes.map(ut => <option value={ut} >{ut}</option>)}
        </select>
      </div>
      <div className="flex items-center justify-between">
        <div>Unit number:</div>
        <textarea className="px-3 py-2 m-2" value={unitNums} rows={8} type="text" onChange={(e) => setUnitNums(e.target.value)} />
      </div>
      {toSubmit.length > 0 && <Button icon={faAddressBook} onClick={() => handleSubmit(toSubmit)}>Submit {buttonText} address(es)</Button>}
    </section>
  )
}

const NewBuildingAddress = ({ building, setBuilding, street, setStreet, setSelectableLayers }) => {

  let [modelAddress, setModelAddress] = useState(null)

  useEffect(() => {
    setSelectableLayers([layers.buildings.interaction, layers.streets.interaction])
  }, [])
  return (
    <>
      {!building && <section className='sidebar-section'>
        <h2>Click a building to begin.</h2>
      </section>}
      {building &&
        <>
          <AssignmentBuilding {...{ building, setModelAddress, setStreet }} />
          {modelAddress && <NewAddressToSubmit {...{ modelAddress, building, street }} />}
        </>
      }

    </>
  )

}

export default NewBuildingAddress;