import React from 'react';
import layers from '../data/layers';
import GeoSourceBadge from './GeoSourceBadge';
import IdBadge from './IdBadge';

const AddressesHere = ({ addresses, setClicked, title=null }) => {

  // Create a "collator": https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/compare
  let collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: "base"
  })

  // sort 'em with the collator and then on street number.
  addresses = addresses.sort((a, b) => collator.compare(b.unit_number, a.unit_number)).sort((a, b) => a.street_number - b.street_number > -1).sort((a, b) => collator.compare(b.street_name, a.street_name))

  return (
    <section className='sidebar-section' style={{ maxHeight: '50vh', borderLeft: `4px solid ${layers['addresses'].color}` }}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base">{addresses.length} linked {title} address{addresses.length > 1 ? `es:` : `:`}</h2>
      </div>
      <div className="overflow-y-auto text-sm pr-3" style={{ maxHeight: '45vh' }}>
        {addresses.map((a, i) => (
          <div key={a.addr_id} className={i + 1 < addresses.length ? "py-1 flex items-center justify-between border-b-2" : "py-1 flex items-center justify-between"}>
            <div className="flex items-center">
              <span className="tabular-nums">{a.street_number} {a.street_prefix} {a.street_name} {a.street_type} {a.unit_type} {a.unit_number}</span>
              <GeoSourceBadge layer={a.geo_source} />
            </div>
            <IdBadge id={a.addr_id} layer={layers["addresses"]} setClicked={setClicked} link />
          </div>
        ))}
      </div>
    </section>
  )
}

export default AddressesHere;