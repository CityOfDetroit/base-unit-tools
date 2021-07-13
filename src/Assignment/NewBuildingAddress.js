import useFeature from '../hooks/useFeature';
import ExplorerFeature from '../Explorer/ExplorerFeature';
import AddressesHere from '../Explorer/AddressesHere';
import IdBadge from '../Explorer/IdBadge';
import layers from '../data/layers';
import { useState, useEffect } from 'react';
import types from '../data/building_types.json'
import Button from '../components/Button';

const AssignmentBuilding = ({ building, setModelAddress }) => {

  let feature = useFeature({
    type: 'buildings',
    id: building,
    f: 'geojson'
  })

  let [addresses, setAddresses] = useState([])

  useEffect(() => {
    let url = layers.addresses.endpoint + `/query?`
    let params = {
      where: `bldg_id = ${building}`,
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
    console.log(feature)
    attributes = {
      "Use type": feature.properties.use_category,
      "Building type": feature.properties.ted_build_type
    }
  }

  return (
    <>
      {feature && <ExplorerFeature {...{ attr: feature.properties, attributes, clicked: clicked }} />}
      {addresses.length > 0 && <AddressesHere {...{ addresses }} />}
    </>
  )
}

const NewBuildingAddress = ({ building, setBuilding, setModelAddress }) => {
  console.log(building)

  let [newAddress, setNewAddress] = useState('')
  return (
    <>
      <section className='sidebar-section'>

        {!building && <h2>Click a building to begin.</h2>}
        {building && <h2>Selected building: {building}</h2>}
      </section>
      {building &&
        <>
          <AssignmentBuilding {...{ building, setModelAddress }} />
          <section className='sidebar-section'>
            <h2>Create new address for this building:</h2>
            <div className="flex items-center justify-between">
                <div>House number:</div>
                <input type="text" className="px-3 m-2" value={newAddress} />
            </div>
            <div className="flex items-center justify-between">
                <div>Street name:</div>
                <input type="text" className="px-3 m-2" value={newAddress} />
            </div>
            <div className="flex items-center justify-between">
                <div>Unit type:</div>
                <input type="text" className="px-3 m-2" value={newAddress} />
            </div>
            <div className="flex items-center justify-between">
                <div>Unit number:</div>
                <input type="text" className="px-3 m-2" value={newAddress} />
            </div>
            <Button>Submit new address</Button>
          </section>
        </>
      }

    </>
  )

}

export default NewBuildingAddress;