
import { faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons'
import buffer from '@turf/buffer'
import difference from '@turf/difference'
import Button from '../../src/components/Button'
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
      <h2>Buffer current selection</h2>
      <div className="flex items-center justify-between mx-2">

      <div className='w-1/2'>

      <input
        type="number"
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
        className="p-2 mr-2 w-1/2"
        />
      <select
        className="p-2"
        onChange={(e) => setUnit(e.target.value)}
        >

        {Object.keys(units).map(u => (
          <option value={u} key={u}>{u}</option>
          ))}

      </select>
      </div>
      </div>
      <div className="p-2 flex gap-2">


      <Button
        icon={faExpandArrowsAlt}
        onClick={() => setGeom(buffer(geom, distanceInMiles, { units: 'miles' }))}
        text={`${distance} ${unit}`}
        small
        />
      <Button
        icon={faExpandArrowsAlt}
        onClick={() => {
          let originalGeom = geom
          let buffered = buffer(geom, distanceInMiles, { units: 'miles' })
          let diff = difference(buffered.features[0], originalGeom.features[0])

          let diffFc = {type: "FeatureCollection", features: [diff]}
          setGeom(diffFc)
        }}
        text={`${distance} ${unit} (buffer only)`}
        small
        />
      </div>

    </section>
  )
}

export default MailerBuffer;

