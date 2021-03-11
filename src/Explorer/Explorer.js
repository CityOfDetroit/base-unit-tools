import { faStreetView, faWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from "react-router-dom";
import StreetView from '../components/StreetView';
import layers from '../data/layers.json';
import SiteSidebar from '../layout/SiteSidebar';
import ExplorerAddress from './ExplorerAddress';
import ExplorerBuilding from './ExplorerBuilding';
import ExplorerMap from './ExplorerMap';
import ExplorerParcel from './ExplorerParcel';
import ExplorerSearch from './ExplorerSearch';
import ExplorerStreet from './ExplorerStreet';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Explorer = () => {

  let query = useQuery()
  let history = useHistory()
  let queryType = query.get("type")
  let queryId = query.get("id")
  let querySv = query.get("streetview")
  let [clicked, setClicked] = useState({
    type: queryType ? queryType : null,
    id: queryId ? queryId : null
  })
  let [feature, setFeature] = useState(null)
  let [linked, setLinked] = useState({
    addresses: [],
    parcels: [],
    buildings: [],
    streets: []
  })

  let [options, setOptions] = useState({
    streetView: querySv === 'true' ? true : false
  })

  const [svCoords, setSvCoords] = useState(null);
  const [svBearing, setSvBearing] = useState(null);

  // effect - we want to fetch data about the clicked feature when it's clicked
  useEffect(() => {
    if (clicked.type && clicked.id) {
      history.push(`?type=${clicked.type}&id=${clicked.id}${options.streetView ? `&streetview=true` : ``}`);
      let layer = layers[clicked.type]
      let url = layer.endpoint
      let fullUrl;
      let SERVER_ROOT = `https://opengis.detroitmi.gov/opengis/rest/services/BaseUnits/`
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

        fullUrl = SERVER_ROOT + url + `/query?` + queryString
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
        fullUrl = SERVER_ROOT + url + `/query?` + queryString
      }


      fetch(fullUrl).then(r => r.json())
        .then(d => {
          setFeature(d.features[0])
        })
    }
  }, [clicked])

  return (
    <>
      <SiteSidebar title="Explorer">
        <section className="sidebar-section">
          <ExplorerSearch {...{ clicked, setClicked }} />
          <div className="mt-2">

            <button
              className={options.streetView ? 'btn-enabled' : 'btn-disabled'}
              onClick={() => setOptions({ ...options, streetView: !options.streetView })}>
              <FontAwesomeIcon icon={faStreetView} />
            </button>
          </div>

        </section>
        {options.streetView && feature && <StreetView {...{ feature, setSvBearing, setSvCoords }} />}
        {clicked.type === 'addresses' && feature && <ExplorerAddress {...{ feature, clicked, setClicked, linked, setLinked }} />}
        {clicked.type === 'buildings' && feature && <ExplorerBuilding {...{ feature, clicked, setClicked, linked, setLinked }} />}
        {clicked.type === 'parcels' && feature && <ExplorerParcel {...{ feature, clicked, setClicked, linked, setLinked }} />}
        {clicked.type === 'streets' && feature && <ExplorerStreet {...{ feature, clicked, setClicked, linked, setLinked }} />}
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
      <main>
        <ExplorerMap {...{ clicked, setClicked, feature, history, svCoords, svBearing, showSv: options.streetView }} />
      </main>
    </>
  )
}

export default Explorer;