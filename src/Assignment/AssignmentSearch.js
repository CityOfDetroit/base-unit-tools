import { useState } from "react";
import Button from '../components/Button'
import { faExclamationTriangle, faSearch } from '@fortawesome/free-solid-svg-icons';


const AssignmentSearch = ({ setSearchValue, type }) => {

    let [value, setValue] = useState('')
  
    return (
        <div className="flex items-center justify-start text-sm mt-1">
          <h2 className="text-base flex items-center justify-between">
            Search for an address on the map:
            {/* what if we couldn't find it? */}
            {type && type === 'none' && 
              <div className="flex items-end justify-start text-xs font-semibold bg-red-400 text-gray-700 px-4 py-1">
                No results found!
              </div>
            }
          </h2>
          <input
            className="p-2 w-1/2 ml-4 bg-"
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
      )
  }

  export default AssignmentSearch;