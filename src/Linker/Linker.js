import React, { useState } from 'react';
import SiteSidebar from '../layout/SiteSidebar'
import useQuery from '../hooks/useQuery'
import useFeature from '../hooks/useFeature'
import layers from '../data/layers'
import LinkerMap from './LinkerMap';

const Link = ({ type, id }) => {
  let feature = useFeature({
    type: type,
    id: id,
    f: 'geojson'
  })

  if (feature) {

    let layer = layers[type]

    return (
      <>
      <h3>{layer.label}</h3>
      <pre className="text-xs">
        {JSON.stringify(feature.properties, null, 2)}
      </pre>
      </>
    )
  }

  else {
    return <div>Loading...</div>
  }
}

const Linker = () => {

  // get some URL params
  let query = useQuery()
  let queryType = query.get("type")
  let queryId = query.get("id")
  let feature = useFeature({
    type: queryType,
    id: queryId,
    f: 'geojson'
  })

  console.log(feature)

  return (
    <>
      <SiteSidebar title="Linker">
        <section className="sidebar-section">
          <h2>Creating links to feature ... {queryType}: {queryId}</h2>

          {feature && 
            <pre className="text-xs"> 
              {JSON.stringify(feature.properties, null, 2)}
            </pre>}

          {feature &&
            <Link type={`buildings`} id={feature.properties.bldg_id}/>
          }
          {feature &&
            <Link type={`parcels`} id={feature.properties.parcel_id}/>
          }
          {feature &&
            <Link type={`streets`} id={feature.properties.street_id}/>
          }

        </section>
      </SiteSidebar>
      <main>
        {feature && <LinkerMap center={feature.geometry.coordinates} />}
      </main>
    </>
  )
}

export default Linker;