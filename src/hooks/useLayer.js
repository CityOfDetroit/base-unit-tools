import { useState, useEffect, useRef } from 'react'
import { queryFeatures } from '@esri/arcgis-rest-feature-layer';

/**
 * useLayer
 * 
 * takes a object with type (addresses, parcels, streets, buildings) and an ID
 * return json result
 * 
 * @param {url: string, where: string}
 * @returns json result
 */
const useLayer = ({ url, where }) => {
  // check for component mount. Setting initial state to false helps prevent an unnecessary call on initial render
  const didMountRef = useRef(false);

  // we store the returned data here
  let [data, setData] = useState(null)

  // this data fetch will fire any time we change the underlying object
  useEffect(() => {
    console.log("Entered useLayer")

    // TODO: initial load will send something like "address_id = null". may need to prevent this
    if (didMountRef.current) { 
      if(url && where){
        console.log("Where: " + where)
        console.log(where)
        queryLayer(url, where).catch(console.error);
      }
    }

    didMountRef.current = true;
  }, [url, where])

  const queryLayer = async (url, where) => {
    const data = await queryFeatures({
      url: url,
      outFields: '*',
      where: where,
      f: 'json'
    })

    setData(data);
  }

  return data
}

export default useLayer;

