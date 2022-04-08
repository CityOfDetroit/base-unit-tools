import React, { useState } from 'react';
import layers from '../data/layers';
import GeoSourceBadge from './GeoSourceBadge';
import IdBadge from './IdBadge';
import AnimateHeight from 'react-animate-height';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleDown, faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';

const AddressesHere = ({ addresses, setClicked, title=null }) => {

  // Create a "collator": https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/compare
  let collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: "base"
  })

  // sort 'em with the collator and then on street number.
  addresses = addresses.sort((a, b) => collator.compare(b.unit_number, a.unit_number)).sort((a, b) => a.street_number - b.street_number > -1).sort((a, b) => collator.compare(b.street_name, a.street_name))

  let [open, setOpen] = useState(addresses.length > 2 ? false : true);

  return (
    <section className='sidebar-section' style={{ maxHeight: '50vh', borderLeft: `8px solid ${layers['addresses'].color}` }}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm md:text-base">{addresses.length} linked {title} address{addresses.length > 1 ? `es:` : `:`}</h2>
        <FontAwesomeIcon icon={open ? faChevronCircleDown : faChevronCircleRight} className="text-gray-500 text-xl mr-2" onClick={() => setOpen(!open)} />
      </div>
      <AnimateHeight duration={150} height={open ? "auto" : 0} className="overflow-y-scroll max-h-64">
        {addresses.map((a, i) => (
          <div key={a.addr_id} className={i + 1 < addresses.length ? "py-1 flex items-center justify-between border-b-2" : "py-1 flex items-center justify-between"}>
            <div className="flex items-center">
              <span className="tabular-nums">{a.street_number} {a.street_prefix} {a.street_name} {a.street_type} {a.unit_type} {a.unit_number}</span>
              <GeoSourceBadge layer={a.geo_source} />
            </div>
            <IdBadge id={a.addr_id} layer={layers["addresses"]} setClicked={setClicked} link />
          </div>
        ))}
      </AnimateHeight>
    </section>
  )
}

export default AddressesHere;