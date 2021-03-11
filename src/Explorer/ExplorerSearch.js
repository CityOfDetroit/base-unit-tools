import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import React, { useState, useEffect } from 'react';
import { geocoders } from '../Geocoder/Geocoder';

const ExplorerSearch = ({ clicked, setClicked }) => {

  let [value, setValue] = useState('')
  let [found, setFound] = useState(null)

  const geocode = (value, setClicked) => {
    let spacesRe = /\s/g
    let url = `${geocoders[0].url}/findAddressCandidates?SingleLine=${value.replace(spacesRe, '+')}&outFields=*&f=pjson`
    fetch(url)
      .then(r => r.json())
      .then(d => {
        if (Object.keys(d).indexOf('candidates') > -1 && (d.candidates.length > 0)) {
          setClicked({
            type: "addresses",
            id: d.candidates[0].attributes.address_id
          })
          setFound(true)
        }
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
          onKeyPress={(e) => e.code === 'Enter' && geocode(value, setClicked)}
          />
        <button
          className={value !== '' ? 'btn-enabled' : 'btn-disabled'}
          disabled={value === ''}
          onClick={() => geocode(value, setClicked)}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
      {found === false && 
        <div className="flex items-end justify-start text-xs font-semibold bg-red-200 text-gray-700 p-1">
          We couldn't locate that address... please try again.
        </div>
      }
    </>
  )
}

export default ExplorerSearch;