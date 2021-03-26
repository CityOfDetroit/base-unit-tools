
import { faBaby } from '@fortawesome/free-solid-svg-icons'
import buffer from '@turf/buffer'
import Button from '../components/Button'
import {useState} from 'react';

const MailerBuffer = ({ geom, setGeom }) => {

  let units = {
    feet: 0.000189394,
    meters: 0.000621371,
    yards: 0.000568182
  }

  let [distance, setDistance] = useState(300)
  let [unit, setUnit] = useState(Object.keys(units)[0])

  let distanceInMiles = distance * units[unit]

  return (
    <section className="sidebar-section">
    <h2>Buffer your feature</h2>
    <p>
      Apply a buffer to the feature
    </p>
    <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} className="p-2 mr-2" />
    <select onChange={(e) => setUnit(e.target.value)} className="p-2">
      {Object.keys(units).map(u => (
        <option value={u}>{u}</option>
      ))}
    </select>
    <Button icon={faBaby} onClick={() => setGeom(buffer(geom, distanceInMiles, {units: 'miles'}))} text={`Buffer by ${distance} ${unit}`} />
  </section>
  )
}

export default MailerBuffer;

