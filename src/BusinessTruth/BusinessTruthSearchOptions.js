import { faMapMarked, faRoad, faStreetView } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../components/Button';

const BusinessTruthSearchOptions = ({ options, setOptions }) => {

  const searchTypes = {
    'default': 'Business',
    'address': 'Address',
  }

  return (
    <section className="flex flex-col items-start">
      <div className="flex justify-around md:justify-start gap-2 w-full">
        {/* Search Type selector */}
        <div className="flex h-9">
          <div className="px-3 font-semibold text-gray-900 flex items-center bg-blue-300 text-sm">
            <FontAwesomeIcon icon={faMapMarked} className="mr-2" />
            <span>Search Type</span>
          </div>
          <select 
            className="pl-2 w-24 text-sm" 
            onChange={(e) => setOptions({ ...options, searchType: e.target.value })}
            >
            {Object.keys(searchTypes).map((k) => (
              <option key={k} value={k}>{searchTypes[k]}</option>
            ))}
          </select>
        </div>
      </div>
    </section>
  )
}

export default BusinessTruthSearchOptions;