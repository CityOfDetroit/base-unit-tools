import { faSearch } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import { geocoders } from '../data/geocoders';

// we call this function when we actually want to geocode the user input
const geocode = (value, setGeom, setFound) => {
  // regex to find all spaces 
  let spacesRe = /\s/g
  // ...and replace with '+'
  let url = `${geocoders[3].url}/findAddressCandidates?SingleLine=${value.replace(spacesRe, '+')}&outFields=*&f=pjson`
  
  // make the geocode request
  // TODO: replace this with method from esri library
  fetch(url)
    .then(r => r.json())
    .then(d => {
      // does candidates exist and there's at least 1?
      if (Object.keys(d).indexOf('candidates') > -1 && (d.candidates.length > 0)) {
        // we set a new clicked feature
        setGeom({
          type: "FeatureCollection",
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [d.candidates[0].location.x, d.candidates[0].location.y],
              },
              properties: {}
            }
          ]
        })
        setFound(true)
      }
      // TODO replace this with the esri-arcgis-rest geocoding library.
      else {
        let centerlineUrl = `https://gis.detroitmi.gov/arcgis/rest/services/DoIT/StreetCenterlineGeocoder/GeocodeServer/findAddressCandidates?Single+Line+Input=${value.replace(spacesRe, '+')}&outFields=*&outSR=4326&f=pjson`
        fetch(centerlineUrl)
          .then(r => r.json())
          .then(d => {
            if (Object.keys(d).indexOf('candidates') > -1 && (d.candidates.length > 0)) {
              setGeom({
                type: "FeatureCollection",
                features: [
                  {
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: [d.candidates[0].location.x, d.candidates[0].location.y]
                    },
                    properties: {}
                  }
                ]
              })
            }
            else {
              setFound(false)
            }
          })
      }
    })
}

const MailerAddressSearch = ({ geom, setGeom }) => {

  // set up two values: one for the user input
  let [value, setValue] = useState('')
  // and one to tell us if the value was found
  let [found, setFound] = useState(null)

  // when we get a new clicked feature, reset.
  useEffect(() => {
    setFound(null)
    setValue('')
  }, [geom])

  return (
    <section className='sidebar-section'>
      <h2 className="flex items-center justify-between">
        Search for an address:
        {/* what if we couldn't find it? */}
        {found === false && 
          <div className="flex items-end justify-start text-xs font-semibold bg-red-400 text-gray-700 px-4 py-1">
            No results found!
          </div>
        }
      </h2>
      <div className="flex items-center justify-start text-sm">
        <input
          className="p-3 w-full bg-"
          type="text"
          value={value}
          onChange={(e) => {setValue(e.target.value); setFound(null);}} 
          onKeyPress={(e) => e.code === 'Enter' && geocode(value, setGeom, setFound)}
          />
        <Button
          active={value !== ''}
          disabled={value === ''}
          small
          className="py-2"
          onClick={() => geocode(value, setGeom, setFound)}
          text='Search'
          icon={faSearch} />
      </div>

    </section>
  )
}

export default MailerAddressSearch;