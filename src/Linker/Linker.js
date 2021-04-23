import React, { useEffect, useState } from 'react';
import SiteSidebar from '../layout/SiteSidebar'
import useQuery from '../hooks/useQuery'
import useFeature from '../hooks/useFeature'
import LinkerMap from './LinkerMap';
import LinkerSubmission from './LinkerSubmission';
import { Link } from './Link';
import Button from '../components/Button'
import useGeocoder from '../hooks/useGeocoder';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const LinkerSearch = ({ setSearchValue, type }) => {

  let [value, setValue] = useState('')

  return (
    <section className="bg-gray-200 p-3 w-1/2">
      <h2 className="text-base flex items-center justify-between">
        Search for an address:
        {/* what if we couldn't find it? */}
        {type && type === 'none' && 
          <div className="flex items-end justify-start text-xs font-semibold bg-red-400 text-gray-700 px-4 py-1">
            No results found!
          </div>
        }
      </h2>
      <div className="flex items-center justify-start text-sm mt-1 w-4/5">
        <input
          className="p-2 w-full bg-"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)} 
          onKeyPress={(e) => e.code === 'Enter' && setSearchValue(value)}
          />
        <Button
          active={value !== ''}
          disabled={value === ''}
          small
          className="py-2"
          onClick={() => setSearchValue(value)}
          text='Search'
          icon={faSearch} />
      </div>

    </section>
  )
}

const Linker = ({ session }) => {

  // get some URL params
  let query = useQuery()
  let queryType = query.get("type")
  let queryId = query.get("id")

  // search
  let [searchValue, setSearchValue] = useState(null)
  let [gcResult, type] = useGeocoder(searchValue)
  console.log(gcResult)

  let id = queryId
  if (gcResult) {
    id = gcResult.features[0].properties.address_id
  }

  let feature = useFeature({
    type: queryType || 'addresses',
    id: id,
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
    if (feature) {
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

        {!feature && 
          <LinkerSearch {...{setSearchValue, type}} />
        }

        {feature &&
          <section className="sidebar-section">
            <h2>Creating links to feature ... {queryType}: {queryId}</h2>
            <pre className="text-xs">
              {JSON.stringify(feature.properties, null, 2)}
            </pre>
          </section>}


        {feature && links.bldg_id &&
          <Link type={`buildings`} id={links.bldg_id} />
        }
        {feature && links.parcel_id &&
          <Link type={`parcels`} id={links.parcel_id} />
        }
        {feature && links.street_id > 0 &&
          <Link type={`streets`} id={links.street_id} />
        }

        {feature && <LinkerSubmission {...{ session, feature, links }} />}
      </SiteSidebar>
      <main>
        {feature && links.fetched && <LinkerMap center={feature.geometry.coordinates} feature={feature} {...{ links, setLinks }} />}
      </main>
    </>
  )
}

export default Linker;