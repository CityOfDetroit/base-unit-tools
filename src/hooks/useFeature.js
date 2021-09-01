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
  let [data, setData] = useState({attributes: {}, properties: {}})

  // initialize empty variables
  let layer, where;

  // if we have a type:
  if (type) {
    layer = type ? layers[type] : null
    // if that layer is parcels
    where = type === 'parcels'
      // wrap the id in single-quotes
      ? `${layer.id_column} = '${id}'`
      // if not parcels, no quotes
      : `${layer.id_column} = ${id}`
  }

  // this data fetch will fire any time we change the underlying object
  useEffect(() => {
    // assuming we have a type & id:
    if (type && id) {
      queryFeatures({
        url: layer.endpoint,
        'where': where,
        'outFields': '*',
        'resultRecordCount': 1,
        'outSR': 4326
      }).then(d => {
        if(f === 'arcjson') {
          setData(d.features[0])
        }
        else { 
          setData(arcgisToGeoJSON(d.features[0]))
        }
      })
    }
  }, [type, id])

  return data
}

export default useFeature;