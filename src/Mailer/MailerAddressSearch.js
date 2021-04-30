import { faSearch } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import {useGeocoder} from '../hooks/useGeocoder';

const MailerAddressSearch = ({ geom, setGeom }) => {

  // set up two values: one for the user input
  let [inputValue, setInputValue] = useState('')
  let [searchValue, setSearchValue] = useState(null)
  let [location, type] = useGeocoder(searchValue)
  
  useEffect(() => {
    setGeom(location)
  }, [location])

  return (
    <section className='sidebar-section'>
      <h2 className="flex items-center justify-between">
        Search for an address:
        {/* what if we couldn't find it? */}
        {type && type === 'none' && 
          <div className="flex items-end justify-start text-xs font-semibold bg-red-400 text-gray-700 px-4 py-1">
            No results found!
          </div>
        }
      </h2>
      <div className="flex items-center justify-start text-sm">
        <input
          className="p-3 w-full bg-"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} 
          onKeyPress={(e) => e.code === 'Enter' && setSearchValue(inputValue)}
          />
        <Button
          active={inputValue !== ''}
          disabled={inputValue === ''}
          small
          className="py-2"
          onClick={() => setSearchValue(inputValue)}
          text='Search'
          icon={faSearch} />
      </div>

    </section>
  )
}

export default MailerAddressSearch;