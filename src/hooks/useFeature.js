import { useState, useEffect } from 'react'
import { queryFeatures } from '@esri/arcgis-rest-feature-layer';
import layers from '../data/layers.js'

/**
 * useFeature
 * 
 * takes a object with type (addresses, parcels, streets, buildings) and an ID
 * returns the ArcJSON item
 * 
 * @param {type: string, id: *}
 * @returns an ArcJSON item
 */
const useFeature = ({ type, id }) => {
  let [data, setData] = useState(null)

  let layer, where;
  if (type) {
    layer = type ? layers[type] : null
    where = type === 'parcels'
      ? `${layer.id_column} = '${id}'`
      : `${layer.id_column} = ${id}`
  }

  useEffect(() => {
    if (type && id) {
      queryFeatures({
        url: layer.endpoint,
        'where': where,
        'outFields': '*',
        'resultRecordCount': 1,
        'outSR': 4326
      })
        .then(d => {
          setData(d.features[0])
        })
    }
  }, [type, id])

  return data
}

export default useFeature;