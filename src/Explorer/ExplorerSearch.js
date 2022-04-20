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
    else if (firstResult && ['StreetAddress', 'StreetInt'].indexOf(firstResult.properties.Addr_type) > -1) {
      setClicked({})
      setGeocoded(featureCollection)
    }
  }, [featureCollection, type])

  return (
    <div className="flex items-center justify-start text-sm md:text-base w-full bg-gray-200 p-2 md:p-3">
      <input
        className="p-2 w-full md:w-1/2"
        type="text"
        value={value}
        placeholder={`Search for an address or intersection`}
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
  )
}

export default ExplorerSearch;