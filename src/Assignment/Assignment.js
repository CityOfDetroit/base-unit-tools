import React, { useEffect, useState } from 'react';
import AppHeader from '../components/AppHeader';
import apps from '../data/apps';
import layers from '../data/layers.js';
import { useGeocoder } from '../hooks/useGeocoder';
import SiteSidebar from '../layout/SiteSidebar';
import AssignmentMap from './AssignmentMap';
import AssignmentSearch from './AssignmentSearch';
import AssignmentMapIndices from './AssignmentMapIndices';
import NewBuildingAddress from './NewBuildingAddress';
import NewUtilityPole from './NewUtilityPole';

const Assignment = ({ session }) => {

  // geocoder states
  const [searchValue, setSearchValue] = useState(null)
  const [data, resultType] = useGeocoder(searchValue)

  // these pieces of state keep track of the currently selected building/parcel/street
  const [building, setBuilding] = useState('')
  const [parcel, setParcel] = useState('')
  const [street, setStreet] = useState('')
  const [addresses, setAddresses] = useState([])
  
  // house number certificate
  let [certNumber, setCertNumber] = useState('')

  // map attribs
  let [center, setCenter] = useState([])

  // define the different modes for the tool and assign one to state
  // each mode has a name, description, and set of selectableLayers
  // the selectable layers should come from the layers object
  // these layers will be clickable by default.
  let modes = [
    {
      name: "New building address",
      description: "Use this to add a new primary address OR new unit addresses to an existing building.",
      selectableLayers: [layers.buildings.interaction]
    },
    {
      name: "New utility pole",
      description: "Use this to add a new utility pole address, not linked to any parcel or building.",
      selectableLayers: [layers.streets.interaction]
    }
  ]

  let [mode, setMode] = useState(modes[0])

  // this keeps track of 
  let [selectableLayers, setSelectableLayers] = useState(modes[0].selectableLayers)

  // when the mode changes..
  useEffect(() => {
    // set b/p/s selection to an empty string
    setBuilding('')
    setParcel('')
    setStreet('')
    setAddresses([])
    // set the selectable layers on the map
    setSelectableLayers(mode.selectableLayers)
  }, [mode])


  // quick intro for the Assignment tool
  let introduction = (
    <>
      <p className="py-2">This tool is for assigning new addresses.</p>
    </>
  )

  return (
    <>
      <SiteSidebar title="Assignment">

        <AppHeader app={apps['assignment']} introduction={introduction}>
        </AppHeader>

        <section className="sidebar-section">
      
          
            <h2 className="w-full">House number certificate:</h2>
            <input type='text' className="px-3 py-2 my-2 w-full" value={certNumber} onChange={(e) => setCertNumber(e.target.value)}></input>
            <h2 className="w-full">Choose an assignment scenario:</h2>
            <select className="px-4 py-3 my-2 w-full" onChange={(e) => setMode(modes.filter(m => m.name === e.target.value)[0])}>
              {modes.map(m => (
                <option value={m.name} key={m.name}>{m.name}</option>
              ))}
            </select>

          <h2>{mode.name}</h2>
          <p>{mode.description}</p>
        </section>

        {mode.name === 'New building address' && <NewBuildingAddress {...{ building, street, setStreet, setSelectableLayers, certNumber, session }} />}
        {mode.name === 'New utility pole' && <NewUtilityPole {...{ street, addresses, setAddresses, setSelectableLayers, session }} />}
      </SiteSidebar>

      <main>
        <section className="bg-gray-300 py-2 px-3">
          <AssignmentSearch setSearchValue={setSearchValue} />
        </section>
        <AssignmentMap geocodeResult={data} {...{ mode, building, parcel, street, setBuilding, setParcel, setStreet, selectableLayers, addresses, setCenter }} />
        <section className="bg-gray-300 py-3 px-3">
          {session && <AssignmentMapIndices center={center} session={session} />}
          {!session && <p>Log in for additional address location information.</p>}
        </section>
      </main>
    </>
  )
}

export default Assignment;