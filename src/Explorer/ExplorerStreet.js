import React, { useEffect, useState } from 'react';
import AddressesHere from './AddressesHere';
import ExplorerFeature from './ExplorerFeature';

const ExplorerStreet = ({ feature, clicked, setClicked, linked, setLinked }) => {

    let { geometry: geom, attributes: attr } = feature;

    let attributes = {
        "Street direction": attr.street_prefix,
        "Street name": attr.street_name,
        "Street type": attr.street_type,
        "Length of segment": attr.segment_length ? `${attr.segment_length.toFixed(0)} ft`: `?`
    }

    let parcelAttributes = {
    }

    let [addresses, setAddresses] = useState([])

    useEffect(() => {
        let url = `https://opengis.detroitmi.gov/opengis/rest/services/BaseUnits/AddressPoints/FeatureServer/0/query?`
        let params = {
            where: `street_id = ${attr.objectid}`,
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
                    }
                    else {
                        setAddresses([])
                    }
                }
            })

    }, [attr.objectid])

    return (
        <>
            <ExplorerFeature {...{attr, attributes, clicked}} />
            {addresses.length > 0 && <AddressesHere {...{addresses, setClicked}} />}
        </>
    )
}

export default ExplorerStreet;