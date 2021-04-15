import { arcgisToGeoJSON } from '@esri/arcgis-to-geojson-utils';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import centroid from '@turf/centroid';
import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import Button from '../components/Button';
import { geocoders } from '../data/geocoders';
import layers from '../data/layers';
import SiteSidebar from '../layout/SiteSidebar';
import IssueReporterExtantAddress from './IssueReporterExtantAddress';
import { IssueReporterFeature } from './IssueReporterFeature';
import IssueReporterMap from './IssueReporterMap';
import { IssueReporterSelector } from './IssueReporterSelector';
import IssueReporterSubmission from './IssueReporterSubmission';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const IssueReporter = ({ session }) => {

  let query = useQuery();

  // get an address string from the URL parameters
  let queryAddress = query.get("address")
  let [value, setValue] = useState(queryAddress ? decodeURIComponent(queryAddress) : '')

  // ...or we can get type/id from params.
  let queryType = query.get("type") || "addresses"
  let queryId = query.get("id") || null
  let [target, setTarget] = useState({
    type: queryType,
    id: queryId
  })

  // this is how we track which type of issue is currently being reported
  let [targetType, setTargetType] = useState(target.type ? 'base_unit' : 'address')
  let [response, setResponse] = useState({
    geocoder: null,
    candidates: [],
    match: {}
  })
  let [feature, setFeature] = useState(null)
  let [mode, setMode] = useState('static')

  const geocode = (value, setResponse) => {
    let spacesRe = /\s/g
    let url = `${geocoders[3].url}/findAddressCandidates?SingleLine=${value.replace(spacesRe, '+')}&outFields=*&f=pjson`
    fetch(url)
      .then(r => r.json())
      .then(d => {
        if (d.candidates.length > 0) {
          setResponse({
            geocoder: 'point',
            candidates: d.candidates,
            match: d.candidates[0].attributes
          })
        }
        else {
          let centerlineUrl = `https://gis.detroitmi.gov/arcgis/rest/services/DoIT/StreetCenterlineGeocoder/GeocodeServer/findAddressCandidates?Single+Line+Input=${value.replace(spacesRe, '+')}&outFields=*&outSR=4326&f=pjson`
          fetch(centerlineUrl)
            .then(r => r.json())
            .then(d => {
              setResponse({
                geocoder: 'centerline',
                candidates: d.candidates,
                match: d.candidates[0].attributes
              })
            })
        }
      })
  }

  const fetchFeature = (target, setFeature) => {
    if (target.type && target.id) {
      let layer = layers[target.type]
      let url = layer.endpoint
      let fullUrl;
      if (target.type === 'parcels') {
        let params = {
          'where': `parcel_id='${target.id}'`,
          'outFields': '*',
          'resultRecordCount': 1,
          'outSR': 4326,
          'f': 'pjson'
        }
        let queryString = Object.keys(params).map((key) => {
          return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
        }).join('&');

        fullUrl = url + `/query?` + queryString
        console.log(fullUrl)
      }
      else {
        let params = {
          'where': `${layer.id_column}=${target.id}`,
          'outFields': '*',
          'resultRecordCount': 1,
          'outSR': 4326,
          'f': 'pjson'
        }
        let queryString = Object.keys(params).map((key) => {
          return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
        }).join('&');
        fullUrl = url + `/query?` + queryString
      }

      console.log(fullUrl)
      fetch(fullUrl).then(r => r.json())
        .then(d => {
          setFeature(d.features[0])
        })
    }
  }

  useEffect(() => {
    
    if (value && targetType === 'address') {
      geocode(value, setResponse)
    }
    if (target.type && target.id && targetType === 'base_unit') {
      fetchFeature(target, setFeature)
    }
  }, [targetType, target])

  let featureCentroid;
  if(feature) {
    featureCentroid = centroid(arcgisToGeoJSON(feature))
  }
  if(response && response.candidates.length > 0) {
    featureCentroid = [response.candidates[0].location.y, response.candidates[0].location.x]
  }
    return (
    <>
      <SiteSidebar title="Issue Reporter">
        <section className="sidebar-section">
          <h2>Report an issue</h2>
          <p>You can report an issue about an address or a specific base unit.</p>

          <IssueReporterSelector {...{setTargetType, targetType, geocode, value, setValue, setResponse, fetchFeature, feature, setFeature, target, setTarget}} />
          
        </section>

        {targetType === 'base_unit' && feature &&
          <IssueReporterFeature clicked={target} attr={feature.attributes} {...{mode, setMode}} />
        }

        {targetType === 'address' && response.geocoder &&
          <section className='sidebar-section'>
            {response.geocoder === 'point' && <IssueReporterExtantAddress {...{ response }} />}
            {response.geocoder === 'centerline' && <h2>No address found</h2>}
          </section>
        }

        {(feature || response.geocoder) && <IssueReporterSubmission {...{value, target, session, targetType, featureCentroid}} />}

      </SiteSidebar>
      <main>
        {(response.geocoder || feature) && <IssueReporterMap {...{ response, target, feature, mode, setMode }} />}
      </main>
    </>
  )
}

export default IssueReporter;