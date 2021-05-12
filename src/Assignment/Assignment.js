import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGeocoder } from '../hooks/useGeocoder';
import SiteSidebar from '../layout/SiteSidebar'

import AssignmentMap from './AssignmentMap';

const Assignment = () => {

  const [address, setAddress] = useState('')

  const [addressToSearch, setAddressToSearch] = useState('134 Calvert')

  const [data, resultType] = useGeocoder(addressToSearch)

  const [buildingToAssign, setBuildingToAssign] = useState(null)

  console.log(data, resultType)

  return (
    <>
      <SiteSidebar title="Assignment">

        <section className="sidebar-section">
          <h2>Type in the address</h2>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}/>
          <button onClick={() => setAddressToSearch(address)}>
            Search
          </button>

          {resultType === 'point' 
            && 
          <div>This address already exists. <Link to={`/explorer?type=addresses&id=${data.features[0].properties.address_id}`}>Go to this address in the explorer.</Link></div>}
          {resultType === 'centerline' && <div>This address doesn't yet exist. Centerline match.</div>}
        </section>

        {resultType === 'centerline' && <section className="sidebar-section">

          <h2>Click a building to assign new address to building.</h2>
        </section>}

      </SiteSidebar>

      <main>
        {data && <AssignmentMap geocodeResult={data} {...{buildingToAssign, setBuildingToAssign}} />}
      </main>
    </>
  )
}

export default Assignment;