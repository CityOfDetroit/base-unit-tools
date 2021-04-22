import { faSearch } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import useGeocoder from '../hooks/useGeocoder';

const ExplorerSearch = ({ clicked, setClicked }) => {

  let [value, setValue] = useState('')
  let [searchValue, setSearchValue] = useState(null)
  let [features, type] = useGeocoder(searchValue)

  // when we get a new clicked feature, reset.
  useEffect(() => {
    type === 'point' && setClicked({
      type: "addresses",
      id: features[0].properties.address_id
    })
  }, [features])

  return (
    <section className="bg-gray-200 p-3 w-1/2">
      <h2 className="text-base flex items-center justify-between">
        Search for an address:
        {/* what if we couldn't find it? */}
        {type && type === 'none' && 
          <div className="flex items-end justify-start text-xs font-semibold bg-red-400 text-gray-700 px-4 py-1">
            No results found!
          </div>
        }
      </h2>
      <div className="flex items-center justify-start text-sm mt-1 w-4/5">
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