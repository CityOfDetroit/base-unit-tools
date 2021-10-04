import React, { useEffect, useState } from 'react';
import AddressesHere from './AddressesHere';
import ExplorerFeature from './ExplorerFeature';
import layers from '../data/layers'

const ExplorerStreet = ({ feature, clicked, setClicked, linked, setLinked }) => {

    let { attributes: attr } = feature;

    // lookup for legalsystem attribute
    let legalSystems = {
      0: `Non-Act 51 certified`,
      1: `State trunkline`,
      2: `County primary`,
      3: `County local`,
      4: `City major`,
      5: `City minor`,
      7: `Other public entity`
    }

    let attributes = {
        "Street direction": attr.street_prefix,
        "Street name": attr.street_name,
        "Street type": attr.street_type,
        "MGF - Left range": `${attr.fraddl}-${attr.toaddl}`,
        "MGF - Right range": `${attr.fraddr}-${attr.toaddr}`,
        "Jurisdiction": legalSystems[attr.legalsystem],
        "Functional class code": attr.fcc,
        "Length of segment": attr.segment_length ? `${attr.segment_length.toFixed(0)} ft`: `?`
    }

    let [addresses, setAddresses] = useState([])

    useEffect(() => {
        let url = `https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/ExtendedTablesWithIndices/FeatureServer/4/query?`
        let params = {
            where: `street_id = ${attr.street_id}`,
            outFields: `*`,
            outSR: 4326,
            f: `pjson`
        }
        let queryString = Object.keys(params).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
        }).join('&');
        fetch(url + queryString)
            .then(r => r.json())
            .then(d => {
                if (Object.keys(d).indexOf('features') > -1) {
                    if (d.features.length > 0) {
                        setAddresses(d.features.map(f => f.attributes))
                        setLinked({
                          addresses: d.features.map(f => f.attributes.addr_id), 
                          streets: [],
                          buildings: Array.from(new Set(d.features.map(f => f.attributes.bldg_id))).filter(n => n !== null),
                          parcels: Array.from(new Set(d.features.map(f => f.attributes.parcel_id))).filter(n => n !== null)
                        })
                    }
                    else {
                        setAddresses([])
                        setLinked({
                          addresses: [], 
                          streets: [],
                          buildings: [],
                          parcels: []
                        })
                    }
                }
            })

    }, [attr.street_id, setLinked])

    return (
        <>
            <ExplorerFeature {...{attr, attributes, clicked}} />
            {addresses.length > 0 && <AddressesHere {...{addresses, setClicked}} />}
        </>
    )
}

export default ExplorerStreet;