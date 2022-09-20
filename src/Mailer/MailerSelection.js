import Button from '../../src/components/Button'
import area from '@turf/area';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const MailerSelection = ({ geom, setGeom, resultIds }) => {
  return (
    <section className='sidebar-section'>
    <h2>Current selection:</h2>
    <ul className="list-disc list-inside">
      <li>
        {(area(geom) * 0.000000386102).toFixed(3)} square miles
      </li>
      {resultIds && <li>
        {resultIds.objectIds.length.toLocaleString()} total addresses in the selection area
      </li>}
    </ul>
    <div className="flex flex-row-reverse">
      <Button 
        icon={faTrash} 
        onClick={() => setGeom(null)} 
        text="Delete current selection"
        small />
    </div>
  </section>
  )
}

export default MailerSelection;