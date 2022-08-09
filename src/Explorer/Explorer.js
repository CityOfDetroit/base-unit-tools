import { faArrowAltCircleRight, faLink, faStreetView, faWrench } from '@fortawesome/free-solid-svg-icons';
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
import SiteHeader from '../layout/SiteHeader';
import IssueReporter from '../components/IssueReporter';
import IssueReporterAddress from '../components/IssueReporterAddress';
import { geocode } from '@esri/arcgis-rest-geocoding';


const Explorer = ({ session, setSession, login, setLogin, currentApp }) => {

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

  // this stores the current geocoding result
  let [geocoded, setGeocoded] = useState(null)

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
  // svBearing is the current camera bearing
  const [svBearing, setSvBearing] = useState(null);
  const [svImage, setSvImage] = useState(null);
  const [svImages, setSvImages] = useState([]);

  // this effect triggers when the user clicks on a new feature in the map
  useEffect(() => {
    if (clicked.type && clicked.id) {
      // push new params to our browser URL
      // TODO see if we can make this work with the back button
      history.push(`?id=${clicked.id}&type=${clicked.type}${options.streetView ? `&streetview=true` : ``}`);
    }
  }, [clicked, history, options.streetView])

  useEffect(() => {
    console.log(geocoded)
  }, [geocoded])

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
      <SiteHeader {...{ session, setSession, login, setLogin, currentApp: 'explorer' }} />      
      <AppHeader app={apps.explorer} introduction={introduction} introOpen={false}>
        <ExplorerMapOptions {...{options, setOptions, session, clicked}} />
      </AppHeader>
      <SiteSidebar title="Explorer">
        {options.streetView && svImages.length === 0 && <section className="">Loading street view imagery...</section>}
        {options.streetView && svImages.length > 0 && <MapillarySv {...{svImage, svImages, setSvImage, setSvBearing, feature}} />}

        {/* based on type, return a specific component. */}
        {clicked.type === 'addresses' && feature && <ExplorerAddress {...{ feature, clicked, setClicked, linked, setLinked }} />}
        {clicked.type === 'buildings' && feature && <ExplorerBuilding {...{ feature, clicked, setClicked, linked, setLinked }} />}
        {clicked.type === 'parcels' && feature && <ExplorerParcel {...{ feature, clicked, setClicked, linked, setLinked }} />}
        {clicked.type === 'streets' && feature && <ExplorerStreet {...{ feature, clicked, setClicked, linked, setLinked }} />}

        {(clicked.type || (geocoded && geocoded.features.length > 0)) && <IssueReporter {...{session, clicked, geocoded, feature}} />}

        {geocoded && geocoded.features.length === 0 && geocoded.input &&
          <section className="sidebar-section">
            <p>We couldn't find any addresses which matched <strong className="">{geocoded.input}</strong>.</p>
            <p>If you think this address should exist, please report an issue here:</p>
            <IssueReporterAddress {...{session, address: geocoded.input, unset: () => setGeocoded(null)}} />
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
        <ExplorerSearch {...{ setClicked, setGeocoded }} />
        <ExplorerMap {...{ clicked, setClicked, geocoded, linked, feature, history, svImage, setSvImages, svBearing, basemap: options.basemap, showSv: options.streetView }} />
      </main>
    </>
  )
}

export default Explorer;