import React from "react";

let types = {
  "PointAddress": {
    "name": `address point`
  },
  "Subaddress": {
    "name": `unit address point`
  },
  "StreetAddress": {
    "name": `street centerline address`
  },
  "StreetInt": {
    "name": `street centerline intersection`
  },
}

const Candidate = ({ candidate }) => {

  let [addr, city, zip] = candidate.properties.address?.split(",");

  return (
    <div>
      <section className="sidebar-section flex items-center justify-between">
        <h3 className="">{addr}</h3>
        <h4>{types[candidate.properties.Addr_type].name}</h4>
      </section>
    </div>
  )
}

export default Candidate