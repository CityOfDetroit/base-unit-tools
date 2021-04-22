import { arcgisToGeoJSON } from '@esri/arcgis-to-geojson-utils';
import centroid from '@turf/centroid';
import React, { useEffect, useState } from 'react';
import layers from '../data/layers';
import SiteSidebar from '../layout/SiteSidebar';
import IssueReporterExtantAddress from './IssueReporterExtantAddress';
import { IssueReporterFeature } from './IssueReporterFeature';
import IssueReporterMap from './IssueReporterMap';
import { IssueReporterSelector } from './IssueReporterSelector';
import IssueReporterSubmission from './IssueReporterSubmission';
import useQuery from '../hooks/useQuery';
import useGeocoder from '../hooks/useGeocoder';

const IssueReporter = ({ session }) => {

  let query = useQuery();

  // get an address string from the URL parameters
  let queryAddress = query.get("address")
  let [value, setValue] = useState(queryAddress ? decodeURIComponent(queryAddress) : '')
  let [searchValue, setSearchValue] = useState(queryAddress ? decodeURIComponent(queryAddress) : null)
  let [featureCollection, type] = useGeocoder(searchValue)

  // ...or we can get type/id from params.
  let queryType = query.get("type") || null
  let queryId = query.get("id") || null
  let [target, setTarget] = useState({
    type: queryType,
    id: queryId
  })

  // this is how we track which type of issue is currently being reported
  let [targetType, setTargetType] = useState(target.type ? 'base_unit' : 'address')

  let [feature, setFeature] = useState(null)

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
      fetch(fullUrl).then(r => r.json())
        .then(d => {
          setFeature(d.features[0])
        })
    }
  }

  useEffect(() => {
    if (value && targetType === 'address') {
      setSearchValue(value)
    }
    if (target.type && target.id && targetType === 'base_unit') {
      fetchFeature(target, setFeature)
    }
  }, [targetType, target])

  let featureCentroid;
  if(feature) {
    featureCentroid = centroid(arcgisToGeoJSON(feature))
  }
  if(featureCollection && featureCollection.features.length > 0) {
    featureCentroid = featureCollection.features[0]
  }
    return (
    <>
      <SiteSidebar title="Issue Reporter">
        <section className="sidebar-section">
          <h2>Report an issue</h2>
          <p>You can report an issue about an address or a specific base unit.</p>

          <IssueReporterSelector {...{setTargetType, targetType, setSearchValue, value, setValue, fetchFeature, feature, setFeature, target, setTarget}} />
          
        </section>

        {targetType === 'base_unit' && feature &&
          <IssueReporterFeature clicked={target} attr={feature.attributes} />
        }

        {targetType === 'address' && type &&
          <section className='sidebar-section'>
            {type === 'point' && <IssueReporterExtantAddress {...{ type, featureCollection }} />}
            {type === 'centerline' && <h2>No address found</h2>}
          </section>
        }

        {(feature || featureCollection) && <IssueReporterSubmission {...{value, target, session, targetType, featureCentroid}} />}

      </SiteSidebar>
      <main>
        {((featureCollection && featureCollection.features.length > 0) || feature) && <IssueReporterMap {...{ type, featureCollection, target, feature, featureCentroid }} />}
      </main>
    </>
  )
}

export default IssueReporter;