import { faMapMarked, faRoad, faStreetView } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../components/Button';

// Object with key names and display values
let basemaps = {
  'default': 'Streets',
  'satellite': 'Satellite',
}

const ExplorerMapOptions = ({ options, setOptions, session, clicked }) => {

  // add to obj on session
  if(session) {
    basemaps['linen-map'] = 'Linen Map'
  }

  return (
    <section className="flex flex-col items-start">
      <div className="flex justify-around md:justify-start gap-2 w-full">
        {/* Street view toggle */}
        <Button
          onClick={() => setOptions({ ...options, streetView: !options.streetView })}
          icon={faStreetView}
          text="Street view"
          active={options.streetView}
          disabled={clicked.id === null}
          className="flex-grow-0"
          small
        />

        {/* Basemap selector */}
        <div className="flex h-9">
          <div className="px-3 font-semibold text-gray-900 flex items-center bg-blue-300 text-sm">
            <FontAwesomeIcon icon={faMapMarked} className="mr-2" />
            <span>Basemap</span>
          </div>
          <select 
            className="pl-2 w-24 text-sm" 
            onChange={(e) => setOptions({ ...options, basemap: e.target.value })}
            >
            {Object.keys(basemaps).map((k) => (
              <option key={k} value={k}>{basemaps[k]}</option>
            ))}
          </select>
        </div>
      </div>
    </section>
  )
}

export default ExplorerMapOptions;