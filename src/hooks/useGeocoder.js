import { useState, useEffect } from 'react'
import { geocode } from '@esri/arcgis-rest-geocoding';
import {geocoders } from '../data/geocoders'

const geocoderUrl = geocoders[0].url

const useGeocoder = (input) => {

  let [data, setData] = useState(null)
  let [resultType, setResultType] = useState('')

  useEffect(() => {
    if (input) {
      geocode({
        endpoint: geocoderUrl,
        singleLine: input,
        outFields: '*'
      }).then(r => {
        if (r.candidates.length > 0) {
          setData(r.geoJson)
          setResultType('point')
        }
        else {
          let spacesRe = /\s/g
          let url = `https://gis.detroitmi.gov/arcgis/rest/services/DoIT/StreetCenterlineGeocoder/GeocodeServer/findAddressCandidates?Single+Line+Input=${input.replace(spacesRe, '+')}&outFields=*&outSR=4326&f=pjson`
          fetch(url)
            .then(s => s.json())
            .then(d => {
              if (d.candidates.length > 0) {
                let add = d.candidates[0]
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
              else {
                setData(null)
                setResultType('none')
              }
            })
        }
      })
    }
  }, [input])

  return [data, resultType]
}

export default useGeocoder;
