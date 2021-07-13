import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGeocoder } from '../hooks/useGeocoder';
import SiteSidebar from '../layout/SiteSidebar'
import AppHeader from '../components/AppHeader';
import apps from '../data/apps';
import AssignmentMap from './AssignmentMap';
import AssignmentSearch from './AssignmentSearch';
import NewBuildingAddress from './NewBuildingAddress'
import NewUtilityPole from './NewUtilityPole';

const Assignment = () => {

  const [searchValue, setSearchValue] = useState(null)
  const [data, resultType] = useGeocoder(searchValue)
  const [building, setBuilding] = useState(null)
  const [parcel, setParcel] = useState(null)
  const [street, setStreet] = useState(null)
  const [modelAddress, setModelAddress] = useState(null)
  const [selectableLayer, setSelectableLayer] = useState(null)

  console.log(data, resultType)

  let introduction = (
    <>
      <p className="py-2">This tool is for assigning new addresses.</p>
    </>
  )

  let modes = [
    {
      type: "Basic",
      name: "New building address",
      description: "Use this to add a new address to an existing building.",
    },
    {
      type: "Utility",
      name: "New utility pole",
      description: "Use this to add a new utility pole address, not linked to any parcel or building.",
    }
  ]

  let [mode, setMode] = useState(modes[0])

  useEffect(() => {
    console.log(searchValue)
  }, [searchValue])


  return (
    <>
      <SiteSidebar title="Assignment">

        <AppHeader app={apps['assignment']} introduction={introduction}>
        </AppHeader>

        <section className="sidebar-section">
          <AssignmentSearch setSearchValue={setSearchValue} />
        </section>

        <section className="sidebar-section">
          <div className="flex items-center justify-between mb-4">
            <h2>Choose an assignment scenario:</h2>
            <select className="px-4 py-3" onChange={(e) => setMode(modes.filter(m => m.name === e.target.value)[0])}>
              {modes.map(m => (
                <option value={m.name}>{m.name}</option>
              ))}
            </select>
          </div>

          <h2>{mode.name}</h2>
          <p>{mode.description}</p>
        </section>

        {mode.name === 'New building address' && <NewBuildingAddress {...{ building, setSelectableLayer, setModelAddress }} />}
        {mode.name === 'New utility pole' && <NewUtilityPole {...{ street, setSelectableLayer }} />}
      </SiteSidebar>

      <main>
        <AssignmentMap geocodeResult={data} {...{ building, parcel, street, setBuilding, setParcel, setStreet, selectableLayer }} />
      </main>
    </>
  )
}

export default Assignment;