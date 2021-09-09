import { faArrowAltCircleRight, faLink, faWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from "react-router-dom";
import AppHeader from '../components/AppHeader';
import apps from '../data/apps';
import SiteSidebar from '../layout/SiteSidebar';
import ExplorerAddress from './ExplorerAddress';
import ExplorerBuilding from './ExplorerBuilding';
import ExplorerMap from './ExplorerMap';
import ExplorerMapOptions from './ExplorerMapOptions';
import ExplorerParcel from './ExplorerParcel';
import ExplorerSearch from './ExplorerSearch';
import ExplorerStreet from './ExplorerStreet';
import useFeature from '../hooks/useFeature';
import useQuery from '../hooks/useQuery';
import MapillarySv from '../components/MapillarySv';


const Explorer = ({ session }) => {

  // query parameters
  let query = useQuery()
  let queryType = query.get("type")
  let queryId = query.get("id")
  let querySv = query.get("streetview")
  let querySvImgKey = query.get("image")

  // we use the history to push params on click
  let history = useHistory()

  // this stores the type and id of the currently clicked feature
  // that drives everything, so the value and setter 
  // are passed to child components often to consult or use
  let [clicked, setClicked] = useState({
    // derive initial values from the URL parameter if we can
    type: queryType ? queryType : null,
    id: queryId ? queryId : null
  })
  let feature = useFeature(clicked)

  // this stores IDs of linked features, to be highlighted on the map.
  let [linked, setLinked] = useState({
    addresses: [],
    parcels: [],
    buildings: [],
    streets: []
  })

  // an options object
  let [options, setOptions] = useState({
    streetView: querySv === 'true' ? true : false,
    basemap: 'default'
  })
  
  // streetview-specific information
  // svCoords is the camera location
  // svBearing is the current camera bearing
  const [svCoords, setSvCoords] = useState(null);
  const [svBearing, setSvBearing] = useState(null);
  const [svImageKey, setSvImageKey] = useState(null)


  // this effect triggers when the user clicks on a new feature in the map
  useEffect(() => {
    if (clicked.type && clicked.id) {
      // push new params to our browser URL
      // TODO see if we can make this work with the back button
      history.push(`?id=${clicked.id}&type=${clicked.type}${options.streetView ? `&streetview=true` : ``}`);
    }
  }, [clicked, history, options.streetView])

  let introduction = (
    <>
      <p>This tool is for exploring the base units and visualizing the relationships between them.</p>
      <p>You can start by:</p>
      <ul className="list-disc list-outside ml-4 pb-2">
        <li>Searching for an address</li>
        <li>Clicking a feature on the map</li>
      </ul>
      <p>Once an address, building, parcel, or street is selected, you'll be able to see the other base units it is linked to.</p>
      <p>Click the <FontAwesomeIcon icon={faArrowAltCircleRight} className="mx-1 tex" /> next to a linked base unit's ID to navigate to that linked unit.</p>
      <p>You can also see a street view image of the currently selected feature, or turn on satellite imagery on the map.</p>
    </>
  )

  return (
    <>
      <SiteSidebar title="Explorer">

        <AppHeader app={apps.explorer} introduction={introduction}>
          <ExplorerSearch {...{ setClicked }} />
          <ExplorerMapOptions {...{options, setOptions, session}} />
        </AppHeader>


        {/* Options area */}

        {/* based on type, return a specific component. */}
        {clicked.type === 'addresses' && feature && <ExplorerAddress {...{ feature, clicked, setClicked, linked, setLinked }} />}
        {clicked.type === 'buildings' && feature && <ExplorerBuilding {...{ feature, clicked, setClicked, linked, setLinked }} />}
        {clicked.type === 'parcels' && feature && <ExplorerParcel {...{ feature, clicked, setClicked, linked, setLinked }} />}
        {clicked.type === 'streets' && feature && <ExplorerStreet {...{ feature, clicked, setClicked, linked, setLinked }} />}

        {/* Street View if selected and we have a feature */}
        {/* {options.streetView && feature && <StreetView {...{ feature, setSvBearing, setSvCoords }} />} */}
        {options.streetView && svImageKey && <MapillarySv {...{svImageKey, setSvImageKey}} />}

        {/* Link to issue reporter */}
        {feature &&
          <section className="sidebar-section warning">
            <Link to={`/issue-reporter?type=${clicked.type}&id=${clicked.id}`}>
              <FontAwesomeIcon icon={faWrench} />
              <span className="text-semibold text-sm ml-2">
                Report an issue here
            </span>
            </Link>
          </section>
        }

        {/* Link to, uh, Linker */}
        {feature && clicked.type === 'addresses' && session &&
          <section className="sidebar-section caution">
            <Link to={`/linker?type=${clicked.type}&id=${clicked.id}`}>
              <FontAwesomeIcon icon={faLink} />
              <span className="text-semibold text-sm ml-2">
                Edit address links
            </span>
            </Link>
          </section>
        }
      </SiteSidebar>

      {/* the main panel contains the map, and we pass it many of our useState variables */}
      <main>
        <ExplorerMap {...{ clicked, setClicked, linked, feature, history, svImageKey, setSvImageKey, svCoords, svBearing, basemap: options.basemap, showSv: options.streetView }} />
      </main>
    </>
  )
}

export default Explorer;