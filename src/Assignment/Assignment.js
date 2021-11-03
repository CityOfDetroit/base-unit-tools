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
import AssignmentMapOptions from './AssignmentMapOptions';

const Assignment = ({ session }) => {

  // geocoder states
  const [searchValue, setSearchValue] = useState(null)
  const [data, resultType] = useGeocoder(searchValue)

  // these pieces of state keep track of the currently selected building/parcel/street
  const [building, setBuilding] = useState('')
  const [parcel, setParcel] = useState('')
  const [street, setStreet] = useState('')
  const [addresses, setAddresses] = useState([])
  const [lngLat, setLngLat] = useState(null)

  // map attribs
  let [center, setCenter] = useState([])

  // an options object
  let [options, setOptions] = useState({
    basemap: 'default'
  })

  // define the different modes for the tool and assign one to state
  // each mode has a name, description, and set of selectableLayers
  // the selectable layers should come from the layers object
  // these layers will be clickable by default.
  let modes = [
    {
      name: "New building address",
      description: "Create a new primary address assigned to a building.",
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
    setLngLat(null)
    // set the selectable layers on the map
    setSelectableLayers(mode.selectableLayers)
  }, [mode])


  // quick intro for the Assignment tool
  let introduction = (
    <>
      <p className="py-2">This tool is for assigning or requesting new addresses.</p>
    </>
  )

  return (
    <>
      <SiteSidebar title="Assignment">

        <AppHeader app={apps['assignment']} introduction={introduction}>
          <div className="flex items-center justify-start">
            <h2 className="text-base w-1/3">Choose a scenario:</h2>
            <select className="p-2 font-bold w-3/5" onChange={(e) => setMode(modes.filter(m => m.name === e.target.value)[0])}>
              {modes.map(m => (
                <option value={m.name} key={m.name}>{m.name}</option>
              ))}
            </select>
          </div>
          <p className="py-2">{mode.description}</p>
        </AppHeader>
        
        {mode.name === 'New building address' && <NewBuildingAddress {...{ building, street, setStreet, parcel, setParcel, setSelectableLayers, session }} />}
        {mode.name === 'New utility pole' && <NewUtilityPole {...{ lngLat, street, addresses, setAddresses, setSelectableLayers, session }} />}
      </SiteSidebar>

      <main>
        <section className="bg-gray-100 flex justify-start px-2">
          <AssignmentMapOptions {...{ options, setOptions, session }} />
          <AssignmentSearch setSearchValue={setSearchValue} /> 


        </section>
        <section className="bg-gray-100 flex justify-start text-base">
          {session && <AssignmentMapIndices center={center} session={session} />}
        </section>
        <AssignmentMap geocodeResult={data} {...{ mode, building, parcel, street, setBuilding, setParcel, setStreet, selectableLayers, lngLat, setLngLat, addresses, setCenter, basemap: options.basemap }} />
        <section className="bg-gray-300 py-3 px-3">
          {!session && <p>Log in for additional address location information.</p>}
        </section>
      </main>
    </>
  )
}

export default Assignment;