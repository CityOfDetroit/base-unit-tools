import { faSatellite, faStreetView } from '@fortawesome/free-solid-svg-icons';
import Button from '../components/Button';

const ExplorerMapOptions = ({ options, setOptions }) => {
  return (
    <section className="bg-gray-200 p-3 w-1/2">   
    <h2 className="text-base">Map options</h2>       
    <div className="mt-1 flex">
      <Button
        onClick={() => setOptions({ ...options, streetView: !options.streetView })}
        icon={faStreetView}
        text="Street view"
        active={options.streetView}
        className="mr-2"
        small
        />
      <Button
        onClick={() => setOptions({ ...options, satellite: !options.satellite })}
        icon={faSatellite}
        text="Satellite imagery"
        active={options.satellite}
        small
        />
    </div>
  </section>
  )
}

export default ExplorerMapOptions;