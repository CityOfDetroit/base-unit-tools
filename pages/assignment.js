import React, { useEffect, useState } from 'react';
import AppHeader from '../src/components/AppHeader';
import apps from '../src/data/apps';
import layers from '../src/data/layers.js';
import { useGeocoder } from '../src/hooks/useGeocoder';
import SiteSidebar from '../src/layout/SiteSidebar';
import AssignmentMap from '../src/Assignment/AssignmentMap';
import AssignmentSearch from '../src/Assignment/AssignmentSearch';
import AssignmentMapIndices from '../src/Assignment/AssignmentMapIndices';
import NewBuildingAddress from '../src/Assignment/NewBuildingAddress';
import NewUtilityPole from '../src/Assignment/NewUtilityPole';
import AssignmentMapOptions from '../src/Assignment/AssignmentMapOptions';
import { faBolt, faCut, faHotel, faPlusCircle, faRandom, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../src/components/Button';
import NewParcelRevisionAddress from '../src/Assignment/NewParcelRevisionAddress';
import NewCondoAddress from '../src/Assignment/NewCondoAddress';
import NewStreetExistingAddress from '../src/Assignment/NewStreetExistingAddress';

const Assignment = ({ session, setSession, login, setLogin }) => {

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
      description: "Assign a new primary or unit address to a building.",
      selectableLayers: [layers.buildings.interaction],
      icon: faPlusCircle,
      basemap: 'default'
    },
    {
      name: "New utility address",
      description: "Assign an address for a new utility - not linked to any parcel or building.",
      selectableLayers: [layers.streets.interaction],
      icon: faBolt,
      basemap: 'satellite'
    },
    {
      name: "New condo address",
      description: "Assign an address for a condominium.",
      selectableLayers: [layers.parcels.interaction],
      icon: faHotel,
      basemap: 'default'
    },
    {
      name: "New address for pending parcel revision",
      description: "Assign an address for a new parcel split",
      selectableLayers: [layers.parcels.interaction],
      icon: faCut,
      basemap: 'default'
    },
    {
      name: "New street for existing address",
      description: "Change a current address to a new street segment",
      selectableLayers: [layers.addresses.interaction],
      icon: faRandom,
      basemap: 'default'
    }
  ]

  let [mode, setMode] = useState(null)

  // this keeps track of 
  let [selectableLayers, setSelectableLayers] = useState(null)

  // when the mode changes..
  useEffect(() => {
    // set b/p/s selection to an empty string
    setBuilding('')
    setParcel('')
    setStreet('')
    setAddresses([])
    setLngLat(null)
    // set the selectable layers on the map
    setSelectableLayers(mode ? mode.selectableLayers : [])
  }, [mode])


  // quick intro for the Assignment tool
  let introduction = (
    <>
      <p>This tool is for assigning or requesting new addresses.</p>
      <p>Please choose from the following scenarios:</p>
    </>
  )

  return (
    <>
      {!mode && <AppHeader app={apps['assignment']} introduction={introduction} startsOpen />}
      <SiteSidebar title="Assignment">
        {mode &&
          <div className="bg-gray-300 p-2 flex items-center justify-between">
            <div className="flex">
              <div className="flex items-center justify-around w-12">
                <FontAwesomeIcon icon={mode.icon} className="text-2xl mr-2" />
              </div>
              <div>
                <h3>{mode.name}</h3>
                <p>{mode.description}</p>
              </div>
            </div>
            <Button icon={faWindowClose} onClick={() => setMode(null)}>Back</Button>
          </div>
        }

        {!mode && modes.map(m => (
          <div key={m.name} className="bg-gray-300 my-4 p-2 flex items-center hover:bg-gray-200" onClick={() => setMode(m)}>
            <div className="flex items-center justify-around w-12">
              <FontAwesomeIcon icon={m.icon} className="text-2xl mr-2" />
            </div>
            <div>
              <h3>{m.name}</h3>
              <p>{m.description}</p>
            </div>
          </div>
        ))}

        {mode && mode.name === 'New building address' && <NewBuildingAddress {...{ building, street, setStreet, parcel, setParcel, setSelectableLayers, session }} />}
        {mode && mode.name === 'New utility address' && <NewUtilityPole {...{ lngLat, street, setStreet, addresses, setAddresses, setSelectableLayers, session }} />}
        {mode && mode.name === 'New address for pending parcel revision' && <NewParcelRevisionAddress {...{ lngLat, street, setStreet, parcel, setParcel, addresses, setAddresses, setSelectableLayers, session }} />}
        {mode && mode.name === 'New condo address' && <NewCondoAddress {...{ building, setBuilding, lngLat, street, setStreet, parcel, setParcel, addresses, setAddresses, setSelectableLayers, session }} />}
        {mode && mode.name === 'New street for existing address' && <NewStreetExistingAddress {...{ building, setBuilding, lngLat, street, setStreet, parcel, setParcel, addresses, setAddresses, setSelectableLayers, session }} />}
      </SiteSidebar>

      <main>
        {mode &&
          <>
            <section className="bg-gray-100 flex justify-start px-2">
              <AssignmentMapOptions {...{ options, setOptions, session }} />
              <AssignmentSearch setSearchValue={setSearchValue} />
            </section>
            <section className="bg-gray-100 flex justify-start text-base">
              {session && <AssignmentMapIndices center={center} session={session} />}
            </section>
          </>
        }
        {mode &&
          <AssignmentMap geocodeResult={data} {...{ mode, building, parcel, street, setBuilding, setParcel, setStreet, selectableLayers, lngLat, setLngLat, addresses, setCenter, basemap: options.basemap }} />
        }
        {!session && <section className="bg-gray-300 py-3 px-3">
          <p>Log in for additional address location information.</p>
        </section>}
      </main>
    </>
  )
}

export default Assignment;