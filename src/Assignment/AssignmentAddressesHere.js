import { faChevronCircleDown, faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import AnimateHeight from 'react-animate-height';
import layers from '../data/layers';
import GeoSourceBadge from '../Explorer/GeoSourceBadge';
import IdBadge from '../Explorer/IdBadge';

const AssignmentAddressesHere = ({ addresses, setClicked, title = null }) => {

  // Create a "collator": https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/compare
  let collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: "base"
  })

  // sort 'em with the collator and then on street number.
  addresses = addresses.sort((a, b) => collator.compare(b.unit_number, a.unit_number)).sort((a, b) => a.street_number - b.street_number > -1).sort((a, b) => collator.compare(b.street_name, a.street_name))


  let [open, setOpen] = useState(false)

  return (
    <section className='text-xs py-2 px-2 bg-gray-200' style={{ maxHeight: '50vh', marginBottom: 0, borderLeft: `8px solid ${layers['addresses'].color}` }}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm">with {addresses.length} existing address{addresses.length > 1 ? `es:` : `:`}</h2>
        <FontAwesomeIcon icon={open ? faChevronCircleDown : faChevronCircleRight} onClick={() => setOpen(!open)} className="text-lg text-gray-500 mr-2 mt-1" />
      </div>
      <AnimateHeight
        duration={250}
        height={open ? 'auto' : 0}>

        <div className="overflow-y-auto text-sm pr-3 mt-3" style={{ maxHeight: 250 }}>
          {addresses.map((a, i) => (
            <div key={a.addr_id} className={i + 1 < addresses.length ? "py-1 flex items-center justify-between border-b-2" : "py-1 flex items-center justify-between"}>
              <div className="flex items-center">
                <span className="tabular-nums text-xs">{a.street_number} {a.street_prefix} {a.street_name} {a.street_type} {a.unit_type} {a.unit_number}</span>
                <GeoSourceBadge layer={a.geo_source} />
              </div>
              <IdBadge id={a.addr_id} layer={layers["addresses"]} link={false} />
            </div>
          ))}
        </div>
      </AnimateHeight>
    </section>
  )
}

export default AssignmentAddressesHere;