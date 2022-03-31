import { faSearch } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import {useGeocoder} from '../hooks/useGeocoder';

const ExplorerSearch = ({ setClicked, setGeocoded }) => {

  let [value, setValue] = useState('')
  let [searchValue, setSearchValue] = useState(null)
  let [featureCollection, type] = useGeocoder(searchValue)

  // when we get a new clicked feature, reset.
  useEffect(() => {
    let firstResult = featureCollection?.features[0]
    if (firstResult && firstResult.properties.Addr_type === 'PointAddress') {
      setClicked({
        type: 'addresses',
        id: firstResult.properties.address_id
      })
      setGeocoded(featureCollection)
    }
    else if (firstResult && firstResult.properties.Addr_type === 'StreetAddress') {
      setGeocoded(featureCollection)
    }
  }, [featureCollection, type])

  return (
    <section className="my-1">
      <h2 className="text-sm md:text-base flex items-center justify-between">
        Search for an address:
        {/* what if we couldn't find it? */}
        {type && type === '' && 
          <div className="flex items-end justify-start text-xs font-semibold bg-red-400 text-gray-700 px-4 py-1">
            No results found!
          </div>
        }
      </h2>
      <div className="flex items-center justify-start text-sm md:text-base mt-1 w-full md:w-4/5">
        <input
          className="p-2 w-full bg-"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)} 
          onKeyPress={(e) => e.code === 'Enter' && setSearchValue(value)}
          />
        <Button
          active={value !== ''}
          disabled={value === ''}
          small
          className="py-2"
          onClick={() => setSearchValue(value)}
          text='Search'
          icon={faSearch} />
      </div>

    </section>
  )
}

export default ExplorerSearch;