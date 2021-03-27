import { faSatellite, faStreetView, faWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from "react-router-dom";
import Button from '../components/Button';
import StreetView from '../components/StreetView';
import layers from '../data/layers';
import SiteSidebar from '../layout/SiteSidebar';
import ExplorerAddress from './ExplorerAddress';
import ExplorerBuilding from './ExplorerBuilding';
import ExplorerMap from './ExplorerMap';
import ExplorerParcel from './ExplorerParcel';
import ExplorerSearch from './ExplorerSearch';
import ExplorerStreet from './ExplorerStreet';

// a very tiny helper function
// that i don't fully understand
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Explorer = () => {

  // query parameters
  let query = useQuery()
  let queryType = query.get("type")
  let queryId = query.get("id")
  let querySv = query.get("streetview")

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

  // this stores the fetched feature
  let [feature, setFeature] = useState(null)

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
    satellite: false
  })
  
  // streetview-specific information
  // svCoords is the camera location
  // svBearing is the current camera bearing
  const [svCoords, setSvCoords] = useState(null);
  const [svBearing, setSvBearing] = useState(null);

  // this effect triggers when the user clicks on a new feature in the map
  useEffect(() => {

    // a big hunk of code which constructs the proper URL to go fetch
    // TODO extract this into a function.
    if (clicked.type && clicked.id) {

      // push new params to our browser URL
      // TODO see if we can make this work with the back button
      history.push(`?type=${clicked.type}&id=${clicked.id}${options.streetView ? `&streetview=true` : ``}`);

      // TODO all this can probably be extracted into a function
      let layer = layers[clicked.type]
      let url = layer.endpoint
      let fullUrl;
      if (clicked.type === 'parcels') {
        let params = {
          'where': `parcel_id='${clicked.id}'`,
          'outFields': '*',
          'resultRecordCount': 1,
          'outSR': 4326,
          'f': 'pjson',
        }
        let queryString = Object.keys(params).map((key) => {
          return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
        }).join('&');

        fullUrl = url + `/query?` + queryString
      }
      else {
        let params = {
          'where': `${layer.id_column}=${clicked.id}`,
          'outFields': '*',
          'resultRecordCount': 1,
          'outSR': 4326,
          'f': 'pjson',
        }
        let queryString = Object.keys(params).map((key) => {
          return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
        }).join('&');
        fullUrl = url + `/query?` + queryString
      }

      // TODO ... and then our function would return the fullUrl here.
      fetch(fullUrl).then(r => r.json())
        .then(d => {
          setFeature(d.features[0])
        })
    }
  }, [clicked, history, options.streetView])

  return (
    <>
      <SiteSidebar title="Explorer">

        {/* Search area */}
        <section className="sidebar-section">
          <ExplorerSearch {...{ clicked, setClicked }} />
        </section>

        {/* Options area */}
        <section className="sidebar-section">   
          <h2>Map options</h2>       
          <div className="mt-1 flex">
            <Button
              onClick={() => setOptions({ ...options, streetView: !options.streetView })}
              icon={faStreetView}
              text="Street view"
              active={options.streetView}
              className="mr-2"
              small
              />
            <Button
              onClick={() => setOptions({ ...options, satellite: !options.satellite })}
              icon={faSatellite}
              text="Satellite imagery"
              active={options.satellite}
              small
              />
          </div>
        </section>

        {/* Street View if selected and we have a feature */}
        {options.streetView && feature && <StreetView {...{ feature, setSvBearing, setSvCoords }} />}

        {/* based on type, return a specific component. */}
        {clicked.type === 'addresses' && feature && <ExplorerAddress {...{ feature, clicked, setClicked, linked, setLinked }} />}
        {clicked.type === 'buildings' && feature && <ExplorerBuilding {...{ feature, clicked, setClicked, linked, setLinked }} />}
        {clicked.type === 'parcels' && feature && <ExplorerParcel {...{ feature, clicked, setClicked, linked, setLinked }} />}
        {clicked.type === 'streets' && feature && <ExplorerStreet {...{ feature, clicked, setClicked, linked, setLinked }} />}

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
      </SiteSidebar>

      {/* the main panel contains the map, and we pass it many of our useState variables */}
      <main>
        <ExplorerMap {...{ clicked, setClicked, linked, feature, history, svCoords, svBearing, showSv: options.streetView, showSatellite: options.satellite }} />
      </main>
    </>
  )
}

export default Explorer;