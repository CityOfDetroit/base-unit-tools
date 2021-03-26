
import { faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons'
import buffer from '@turf/buffer'
import Button from '../components/Button'
import { useState } from 'react';

const MailerBuffer = ({ geom, setGeom }) => {

  // set up a default distance of 300
  let [distance, setDistance] = useState(300)

  // units we want to support, and a conversion factor to miles.
  let units = {
    feet: 0.000189394,
    meters: 0.000621371,
    yards: 0.000568182
  }

  // set up with the first unit as default
  let [unit, setUnit] = useState(Object.keys(units)[0])

  // calculate the distance in miles with the conversion factor
  let distanceInMiles = distance * units[unit]

  return (
    <section className="sidebar-section">
      <h2>Buffer your feature</h2>
      <p>
        Apply a buffer to the feature
      </p>
      <input
        type="number"
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
        className="p-2 mr-2"
      />
      <select
        className="p-2"
        onChange={(e) => setUnit(e.target.value)}
      >

        {Object.keys(units).map(u => (
          <option value={u}>{u}</option>
        ))}

      </select>

      <Button
        icon={faExpandArrowsAlt}
        onClick={() => setGeom(buffer(geom, distanceInMiles, { units: 'miles' }))}
        text={`Buffer by ${distance} ${unit}`}
      />

    </section>
  )
}

export default MailerBuffer;

