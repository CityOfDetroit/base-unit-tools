import { useState, useEffect } from 'react'
import { geocode } from '@esri/arcgis-rest-geocoding';

let geocoders = {
  org: `https://opengis.detroitmi.gov/opengis/rest/services/BaseUnits/BaseUnitsGeocoder/GeocodeServer`,
  prod: `https://opengis.detroitmi.gov/opengis/rest/services/BaseUnits/BaseUnitGeocoderWUnitsTest/GeocodeServer`,
  dev: `https://opengis.detroitmi.gov/opengis/rest/services/BaseUnits/BUGeocoderShp/GeocodeServer`
}

export const geocoderUrl = geocoders.dev

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
        // we did not get a result: fall back to the street centerline geocoder
        else {
          let spacesRe = /\s/g
          // which does not seem to be supported by the Esri library, so we manually fetch using this URL template
          let url = `https://gis.detroitmi.gov/arcgis/rest/services/DoIT/StreetCenterlineGeocoder/GeocodeServer/findAddressCandidates?Single+Line+Input=${input.replace(spacesRe, '+')}&outFields=*&outSR=4326&f=pjson`
          fetch(url)
            .then(s => s.json())
            .then(d => {
              if (d.candidates.length > 0) {
                let add = d.candidates[0]
                // manually creating a FeatureCollection here
                setData({
                  type: 'FeatureCollection',
                  features: [
                    {
                      type: "Feature",
                      properties: { ...add.attributes },
                      geometry: {
                        type: "Point",
                        coordinates: [add.location.x, add.location.y]
                      }
                    }
                  ]
                })
                setResultType('centerline')
              }
              // if there was no match on either geocoder, we return [null, 'none']
              else {
                setData(null)
                setResultType('none')
              }
            })
        }
      })
    }
  }, [input])

  // return the featureCollection and the string with the match type
  return [data, resultType]
}