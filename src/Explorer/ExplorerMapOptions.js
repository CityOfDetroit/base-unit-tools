import { faMapMarked, faRoad, faStreetView } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../components/Button';

// Object with key names and display values
let basemaps = {
  'default': 'Streets',
  'satellite': 'Satellite',
  'linen-map': 'Linen Map'
}

const ExplorerMapOptions = ({ options, setOptions }) => {
  return (
    <>
      <h2 className="text-base">Map options</h2>

      <div className="mt-1 flex">
        {/* Street view toggle */}
        <Button
          onClick={() => setOptions({ ...options, streetView: !options.streetView })}
          icon={faStreetView}
          text="Street view"
          active={options.streetView}
          className="mr-2"
          small
        />

        {/* Basemap selector */}
        <div className="flex items-center my-2">
          <div className="h-9 px-2 font-semibold text-gray-900 text-sm flex items-center bg-blue-300">
            <FontAwesomeIcon icon={faMapMarked} className="mr-2" />
            <span>Basemap</span>
          </div>
          <select 
            className="h-9 text-base pl-2 w-32" 
            onChange={(e) => setOptions({ ...options, basemap: e.target.value })}
            >
            {Object.keys(basemaps).map((k) => (
              <option className="text-base" value={k}>{basemaps[k]}</option>
            ))}
          </select>
        </div>
      </div>
    </>
  )
}

export default ExplorerMapOptions;