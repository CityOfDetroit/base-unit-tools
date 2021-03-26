import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import React, { useState, useEffect } from 'react';
import { geocoders } from '../data/geocoders';

// we call this function when we actually want to geocode the user input
const geocode = (value, setClicked, setFound) => {
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
        setClicked({
          type: "addresses",
          id: d.candidates[0].attributes.address_id
        })
        setFound(true)
      }
      // TODO replace this with the esri-arcgis-rest geocoding library.
      else {
        let centerlineUrl = `https://gis.detroitmi.gov/arcgis/rest/services/DoIT/StreetCenterlineGeocoder/GeocodeServer/findAddressCandidates?Single+Line+Input=${value.replace(spacesRe, '+')}&outFields=*&outSR=4326&f=pjson`
        fetch(centerlineUrl)
          .then(r => r.json())
          .then(d => {
            setFound(false)
          })
      }
    })
}

const ExplorerSearch = ({ clicked, setClicked }) => {

  // set up two values: one for the user input
  let [value, setValue] = useState('')
  // and one to tell us if the value was found
  let [found, setFound] = useState(null)

  // when we get a new clicked feature, reset.
  useEffect(() => {
    setFound(null)
    setValue('')
  }, [clicked])

  return (
    <>
      <h2>Search for an address:</h2>
      <div className="flex items-end justify-start text-sm mt-1">
        <input
          className="p-2 w-full bg-gray-200"
          type="text"
          value={value}
          onChange={(e) => {setValue(e.target.value); setFound(null);}} 
          onKeyPress={(e) => e.code === 'Enter' && geocode(value, setClicked, setFound)}
          />
        <button
          className={value !== '' ? 'btn-enabled' : 'btn-disabled'}
          disabled={value === ''}
          onClick={() => geocode(value, setClicked, setFound)}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
      {/* what if we couldn't find it? */}
      {found === false && 
        <div className="flex items-end justify-start text-xs font-semibold bg-red-200 text-gray-700 p-1">
          We couldn't locate that address... please try again.
        </div>
      }
    </>
  )
}

export default ExplorerSearch;