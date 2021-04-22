import React, { useEffect, useState } from 'react';
import SiteSidebar from '../layout/SiteSidebar'
import useQuery from '../hooks/useQuery'
import useFeature from '../hooks/useFeature'
import LinkerMap from './LinkerMap';
import LinkerSubmission from './LinkerSubmission';
import { Link } from './Link';

const Linker = ({ session }) => {

  // get some URL params
  let query = useQuery()
  let queryType = query.get("type")
  let queryId = query.get("id")
  let feature = useFeature({
    type: queryType,
    id: queryId,
    f: 'geojson'
  })

  // store the links in state so we can manipulate them
  let [links, setLinks] = useState({
    fetched: false,
    bldg_id: null,
    parcel_id: null,
    street_id: null
  })

  // new feature? refresh links.
  useEffect(() => {
    if(feature) {
      setLinks({
        fetched: true,
        bldg_id: feature.properties.bldg_id,
        parcel_id: feature.properties.parcel_id,
        street_id: feature.properties.street_id
      })
    }
  }, [feature])
  
  return (
    <>
      <SiteSidebar title="Linker">
        <section className="sidebar-section">
          <h2>Creating links to feature ... {queryType}: {queryId}</h2>

          {feature && 
            <pre className="text-xs"> 
              {JSON.stringify(feature.properties, null, 2)}
            </pre>}


        </section>
          {feature && links.bldg_id &&
            <Link type={`buildings`} id={links.bldg_id}/>
          }
          {feature && links.parcel_id &&
            <Link type={`parcels`} id={links.parcel_id}/>
          }
          {feature && links.street_id > 0 &&
            <Link type={`streets`} id={links.street_id}/>
          }

        {feature && <LinkerSubmission {...{session, feature, links}} />}
      </SiteSidebar>
      <main>
        {feature && links.fetched && <LinkerMap center={feature.geometry.coordinates} feature={feature} {...{links, setLinks}} />}
      </main>
    </>
  )
}

export default Linker;