
import { faBaby } from '@fortawesome/free-solid-svg-icons'
import buffer from '@turf/buffer'
import Button from '../components/Button'

const MailerBuffer = ({ geom, setGeom }) => {
  return (
    <section className="sidebar-section">
    <h2>Buffer your feature</h2>
    <p>
      Apply a buffer to the feature
    </p>
    <Button icon={faBaby} onClick={() => setGeom(buffer(geom, 0.1, {units: 'miles'}))} text="Buffer by 500ft" />
  </section>
  )
}

export default MailerBuffer;

