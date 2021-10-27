import { useState } from "react";
import Button from '../components/Button'
import { faExclamationTriangle, faSearch } from '@fortawesome/free-solid-svg-icons';


const AssignmentSearch = ({ setSearchValue, type }) => {

    let [value, setValue] = useState('')
  
    return (
        <div className="w-2/3 ml-2">
          {/* <h2 className="text-base">Search address:</h2> */}
          {type && type === 'none' && 
            <div className="flex items-end justify-start text-xs font-semibold bg-red-400 text-gray-700 px-4 py-1">
              No results found!
            </div>
          }

        <div className="flex items-center">
          <Button
            active={value !== ''}
            disabled={value === ''}
            small
            className="py-2"
            onClick={() => setSearchValue(value)}
            text='Search'
            icon={faSearch} />
          <input
            className="p-2 w-full bg-"
            type="text"
            placeholder={`Enter an address to center the map there, e.g. "2 Woodward"`}
            value={value}
            onChange={(e) => setValue(e.target.value)} 
            onKeyPress={(e) => e.code === 'Enter' && setSearchValue(value)}
            />
        </div>




        </div>
      )
  }

  export default AssignmentSearch;