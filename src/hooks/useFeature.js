import { useState, useEffect } from 'react'
import { queryFeatures } from '@esri/arcgis-rest-feature-layer';
import layers from '../data/layers.js'
import { arcgisToGeoJSON } from '@esri/arcgis-to-geojson-utils';

/**
 * useFeature
 * 
 * takes a object with type (addresses, parcels, streets, buildings) and an ID
 * returns the ArcJSON item
 * 
 * @param {type: string, id: *}
 * @returns an ArcJSON item
 */
const useFeature = ({ type, id, f='arcjson' }) => {

  // we store the returned data here
  let [data, setData] = useState(null)

  // initialize empty variables
  let layer, where;

  // if we have a type:
  if (type) {
    layer = type ? layers[type] : null
    // if that layer is parcels
    where = type === 'parcels'
      // wrap the id in single-quotes
      ? `${layer.id_column}='${id}'`
      // if not parcels, no quotes
      : `${layer.id_column}=${id}`
  }

  // this data fetch will fire any time we change the underlying object
  useEffect(() => {
    // assuming we have a type & id:
    if (type && id) {
      queryFeatures({
        url: type === "parcels" ? layer.feature_service : layer.endpoint,
        'where': where,
        'outFields': '*',
        'resultRecordCount': 1,
        'outSR': 4326,
        'f': f === 'arcjson' ? 'json' : 'geojson'
      }).then(d => {
        setData(d.features[0])
      })
    }
  }, [type, id])

  if(data) {
    return data
  }
  else {
    return null;
  }
}

export default useFeature;