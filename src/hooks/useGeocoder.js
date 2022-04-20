import { useState, useEffect } from 'react'
import { geocode } from '@esri/arcgis-rest-geocoding';

export const geocoders = {
  prod: `https://opengis.detroitmi.gov/opengis/rest/services/BaseUnits/BaseUnitGeocoder/GeocodeServer`,
  bounds: `https://opengis.detroitmi.gov/opengis/rest/services/BaseUnits/BaseUnitGeocoderBoundaries/GeocodeServer`,
  dev: `https://opengis.detroitmi.gov/opengis/rest/services/BaseUnits/BaseUnitGeocoder_DEV/GeocodeServer`,
  dev2: `https://opengis.detroitmi.gov/opengis/rest/services/Geocoders/TestingJoinIDHypothesisBetaCOmposite/GeocodeServer/`,
  composite: `https://opengis.detroitmi.gov/opengis/rest/services/BaseUnits/BaseUnitGeocoderCenterline/GeocodeServer`,
  point: `https://opengis.detroitmi.gov/opengis/rest/services/BaseUnits/BaseUnitGeocoder/GeocodeServer`,
}

export const geocoderUrl = geocoders.composite

/**
 * useGeocoder custom hook.
 * Returns a 2-element array, where the first element is a GeoJSON FeatureCollection representing the geocoding matches, and the second is the match type.
 * The match type can be either 'point' or 'centerline'.
 * 
 * @param {string} input 
 *        The single-line address input to the geocoder.
 * @returns {[]}
 */
export const useGeocoder = (input) => {

  let [data, setData] = useState(null)
  let [resultType, setResultType] = useState('')

  useEffect(() => {
    if (input) {
      // first, we try to call the base units geocoder
      geocode({
        endpoint: geocoderUrl,
        singleLine: input,
        outFields: '*'
      }).then(r => {
        // if we got a result, return it.
        if (r.candidates.length > 0) {
          setData(r.geoJson)
          setResultType('point')
        }
        else {
        }
      })
    }
  }, [input])

  // return the featureCollection and the string with the match type
  return [data, resultType]
}