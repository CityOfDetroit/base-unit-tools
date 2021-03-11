
import React, { useEffect, useState } from 'react';
import AddressesHere from './AddressesHere'
import BuildingsHere from './BuildingsHere';
import ExplorerFeature from './ExplorerFeature';

const ExplorerParcel = ({ feature, clicked, setClicked, linked, setLinked }) => {

    let { attributes: attr } = feature;

    let attributes = {
        "Parcel address": attr.assessor_address,
        "Assessor's property class": attr.propclassdesc,
        "Taxable status": attr.taxstatus
    }

    let parcelAttributes = {
    }

    let [addresses, setAddresses] = useState([])
    let [buildings, setBuildings] = useState([])

    useEffect(() => {
        let url = `https://opengis.detroitmi.gov/opengis/rest/services/BaseUnits/AddressPoints/FeatureServer/0/query?`
        let params = {
            where: `parcel_id = '${attr.parcel_id}'`,
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
                          streets: Array.from(new Set(d.features.map(f => f.attributes.street_id))),
                          buildings: Array.from(new Set(d.features.map(f => f.attributes.bldg_id))),
                          parcels: []
                        })
                    }
                    else {
                        setAddresses([])
                        setLinked({addresses: [], streets: [], buildings: [], parcels: []})
                    }
                }
            })

    }, [attr.parcel_id])
    
    useEffect(() => {
        let url = `https://opengis.detroitmi.gov/opengis/rest/services/BaseUnits/BuildingMetrics/FeatureServer/0/query?`
        let params = {
            where: `parcel_id = '${attr.parcel_id}'`,
            outFields: `*`,
            outSR: 4326,
            returnGeometry: 'false',
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
                        setBuildings(d.features.map(f => f.attributes))
                    }
                    else {
                        setBuildings([])
                    }
                }
            })

    }, [attr.parcel_id])

    return (
        <>
            <ExplorerFeature {...{attr, attributes, clicked}} />
            {/* <section className='sidebar-section'>
                <div className="flex items-center justify-between py-2">
                    <h2 className="text-xl">Linked parcel:</h2>
                    <p>#{attr.parcel_id}</p>
                </div>
                <table className="w-full">
                    {Object.keys(parcelAttributes).map(f => (
                        <tr>
                            <td className="w-1/3 font-bold text-sm">{f}</td>
                            <td className="">{parcelAttributes[f]}</td>
                        </tr>
                    ))}
                </table>
            </section> */}
            {buildings.length > 0 && <BuildingsHere {...{buildings, setClicked}} />}
            {addresses.length > 0 && <AddressesHere {...{addresses, setClicked}} />}
        </>
    )
}

export default ExplorerParcel;