import { addFeatures } from '@esri/arcgis-rest-feature-layer';
import { faSearch, faWrench } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import Button from '../components/Button';
import { geocoders } from '../data/geocoders';
import layers from '../data/layers';
import IdBadge from '../Explorer/IdBadge';
import SiteSidebar from '../layout/SiteSidebar';
import IssueReporterExtantAddress from './IssueReporterExtantAddress';
import IssueReporterMap from './IssueReporterMap';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const addFeature = ({ session, formText, address, x, y, targetType, targetId, setAddResponse }) => {

  addFeatures({
    url: "https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/address_issues/FeatureServer/0",
    features: [{
      geometry: { x: x, y: y, spatialReference: { wkid: 4326 } },
      attributes: {
        address_string: address,
        target_unit: targetType,
        target_id: targetId ? targetId.toString() : null,
        notes: formText
      }
    }],
    authentication: session ? session : null
  })
    .then(d => setAddResponse(d))
}

const IssueReporterFeature = ({ attr, clicked }) => {

  let layer = layers[clicked.type]

  return (
    <section className='sidebar-section feature' style={{ borderLeft: `8px solid ${layer.color}` }}>
      <div className="flex items-center justify-between text-lg">
        <h2>{layer.label}</h2>
        <div className="flex items-center">
          {/* {hasSource && <span className="font-semibold text-gray-500 bg-gray-300 py-1 px-2 mx-3 text-sm">{attr.geo_source}</span>} */}
          <IdBadge id={attr[layer.id_column]} layer={layer} link={false} />
          {/* <pre className="font-bold" style={{background: '#feb70d'}}>{clicked.type === 'parcels' ? null : `#`}{attr[layer.id_column]}</pre> */}
        </div>
      </div>
    </section>
  )
}

const IssueReporter = ({ session }) => {

  let query = useQuery();

  // get an address string from the URL parameters
  let queryAddress = query.get("address")
  let [value, setValue] = useState(queryAddress ? decodeURIComponent(queryAddress) : '')

  // ...or we can get type/id from params.
  let queryType = query.get("type") || null
  let queryId = query.get("id") || null
  let [target, setTarget] = useState({
    type: queryType,
    id: queryId
  })

  // detroit bbox
  let [xMin, yMin, xMax, yMax] = [-83.237803, 42.355192, -82.910451, 42.45023];
  let xRandomOffset = (xMax - xMin) * Math.random()
  let yRandomOffset = (yMax - yMin) * Math.random()
  let xRandomCenter = xMin + xRandomOffset
  let yRandomCenter = yMin + yRandomOffset

  let [targetType, setTargetType] = useState(target.type ? 'base_unit' : 'address')
  let [returned, setReturned] = useState(false)
  let [center, setCenter] = useState({ lng: xRandomCenter, lat: yRandomCenter })
  let [formText, setFormText] = useState('')

  let [response, setResponse] = useState({
    geocoder: null,
    candidates: [],
    match: {}
  })

  let [sent, setSent] = useState(false)
  let [addResponse, setAddResponse] = useState(null)
  let [feature, setFeature] = useState(null)

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
          'f': 'pjson',
        }
        let queryString = Object.keys(params).map((key) => {
          return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
        }).join('&');

        fullUrl = url + `/query?` + queryString
      }
      else {
        let params = {
          'where': `${layer.id_column}=${target.id}`,
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


      fetch(fullUrl).then(r => r.json())
        .then(d => {
          setFeature(d.features[0])
        })
    }
  }

  useEffect(() => {
    if (value && targetType === 'address') {
      geocode(value, setResponse)
      setAddResponse(null)
    }
    if (target.type && target.id && targetType === 'base_unit') {
      fetchFeature(target, setFeature)
      setAddResponse(null)
    }
  }, [targetType])

  return (
    <>
      <SiteSidebar title="Issue Reporter">
        <section className="sidebar-section">
          <h2>Report an issue</h2>
          <p>You can report an issue about an address or a specific base unit.</p>

          <div className="flex items-center justify-between my-2">
            <h3 className="text-sm w-1/4 flex items-center justify-start" onClick={() => setTargetType('address')}>
              <input type="radio" id="address" name="type" value="address" readOnly
                className="mx-1"
                checked={targetType === 'address'} />
              Address
            </h3>
            <input
              className="p-2 py-3 w-2/3"
              type="text"
              name="address"
              disabled={targetType === 'base_unit'}
              value={value}
              onChange={(e) => setValue(e.target.value) && setReturned(false)}
              onKeyPress={(e) => e.code === 'Enter' && geocode(value, setResponse)}
            />
            <Button
              active={value !== '' && targetType === 'address'}
              onClick={() => geocode(value, setResponse)}
              icon={faSearch}
              text='Search'
              small
            />
          </div>

          <div className="flex items-center justify-between my-2">
            <h3 className="text-sm w-1/4 flex items-center justify-start" onClick={() => { setTargetType('base_unit'); setValue(''); }}>
              <input type="radio" id="base_unit" name="type" value="base_unit"
                className="mx-1"
                readOnly
                checked={targetType === 'base_unit'} />
              Base Unit
              </h3>
            <div className="w-2/3 flex items-center justify-between">
              <select
                className="p-2 py-3"
                disabled={targetType === 'address'}
                value={target.type || 'addresses'}
                onChange={(e) => setTarget({ ...target, type: e.target.value })}
              >
                {Object.keys(layers).map(l => (
                  <option value={l}>{layers[l].label}</option>
                ))}
              </select>

              <input
                className="p-2 py-3 w-40"
                type="text"
                name="address"
                value={target.id ? target.id : ''}
                disabled={targetType === 'address'}
                onChange={(e) => setTarget({ ...target, id: e.target.value }) && setReturned(false)}
                onKeyPress={(e) => e.code === 'Enter' && fetchFeature(target, setFeature)}
              />
            </div>
            <Button
              active={target.id && target.type && targetType === 'base_unit'}
              disabled={targetType === 'address'}
              onClick={() => fetchFeature(target, setFeature)}
              icon={faSearch}
              text='Search'
              small
            />
          </div>
        </section>
        {targetType === 'base_unit' && feature &&
          <IssueReporterFeature clicked={target} attr={feature.attributes} />
        }
        {targetType === 'address' && response.geocoder &&
          <section className='sidebar-section'>
            {response.geocoder === 'point' && <IssueReporterExtantAddress {...{ response }} />}
            {response.geocoder === 'centerline' && <h2>No address found</h2>}
          </section>
        }
        {(feature || response.geocoder) &&
          <section className="sidebar-section">
            <h2>What is the issue?</h2>
            <textarea type="text" cols="40" rows="8" className="p-2 m-1" value={formText} onChange={(e) => { setFormText(e.target.value); setSent(false) }}></textarea>
            <Button
              active={formText !== '' && !sent}
              disabled={formText === ''}
              text={`Submit`}
              icon={faWrench}
              onClick={() => {
                addFeature({
                  session: session,
                  formText: formText,
                  address: targetType === 'address' ? value : null,
                  x: center.lng,
                  y: center.lat,
                  targetType: targetType === 'base_unit' ? target.type.replaceAll(/[es]$/g, '') : null,
                  targetId: targetType === 'base_unit' ? target.id : null,
                  setAddResponse: setAddResponse
                });
                setSent(true);
              }}
            />
          </section>
        }
        {
          addResponse && addResponse.addResults[0].success &&
          <section className="sidebar-section">
            Thanks for your input! <Link to={`/explorer?type=${target.type}&id=${target.id}`}>Jump back to the explorer</Link>
          </section>
        }
      </SiteSidebar>
      <main>
        {(response.geocoder || feature) && <IssueReporterMap {...{ response, target, feature, center, setCenter }} />}
      </main>
    </>
  )
}

export default IssueReporter;