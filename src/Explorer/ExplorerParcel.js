
import React, { useEffect, useState } from 'react';
import layers from '../data/layers';
import AddressesHere from './AddressesHere';
import BuildingsHere from './BuildingsHere';
import ExplorerFeature from './ExplorerFeature';
import moment from 'moment'

const ExplorerParcel = ({ feature, clicked, setClicked, linked, setLinked }) => {

    let { attributes: attr } = feature;

    let attributes = {
        "Parcel address": attr.assessor_address,
        "Assessor's property class": attr.propclassdesc
    }

    let longAttributes = {
    }

    let [addresses, setAddresses] = useState([])
    let [buildings, setBuildings] = useState([])
    let [extendedAttribs, setExtendedAttribs] = useState(null)

    useEffect(() => {

      fetch(`https://apis.detroitmi.gov/assessments/parcel/${attr.parcel_id}/`).then(r => r.json()).then(d => {
        setExtendedAttribs(d)
      })

    }, [attr.parcel_id])

    if(extendedAttribs) {
      longAttributes['Legal description'] = extendedAttribs.legaldescription
      attributes['Taxpayer'] = extendedAttribs.taxpayer1
      extendedAttribs.taxpayer2 && (attributes['Taxpayer (ext)'] = extendedAttribs.taxpayer2)
      attributes['Taxpayer Address'] = `${extendedAttribs.taxpaddr}, ${extendedAttribs.taxpcity}, ${extendedAttribs.taxpstate}`
      extendedAttribs.saledate && (attributes['Sale Date'] = moment(extendedAttribs.saledate).format("LL"))
      extendedAttribs.saledate && (attributes['Sale Price'] = parseInt(extendedAttribs.saleprice).toLocaleString())
      extendedAttribs.pre && (attributes['PRE %'] = extendedAttribs.pre.toLocaleString())
      extendedAttribs.nez && (attributes['NEZ'] = extendedAttribs.nez)
      attributes['Is Improved?'] = extendedAttribs.isimproved === "1" ? `Yes` : `No`
      attributes['Property Class'] = `${extendedAttribs.propclass} - ${extendedAttribs.propclassdesc}`
      attributes['Property Use'] = `${extendedAttribs.usecode} - ${extendedAttribs.usecodedesc}`
      extendedAttribs.total_floor_area && (attributes['Total Floor Area'] = `${extendedAttribs.total_floor_area}`)
      extendedAttribs.style && (attributes['Style'] = `${extendedAttribs.style}`)
      attributes['Taxable Status'] = extendedAttribs.taxstatus
      attributes['Assessed Value'] = parseInt(extendedAttribs.assessedvalue).toLocaleString()
      attributes['Taxable Value'] = parseInt(extendedAttribs.taxablevalue).toLocaleString()
      attributes['Total Acreage'] = extendedAttribs.totalacreage
      attributes['Total Square Footage'] = extendedAttribs.totalsqft
      attributes['Depth x Frontage (ft)'] = `${extendedAttribs.depth} x ${extendedAttribs.frontage}`
      attributes['Zoning'] = extendedAttribs.zoning
    };

    useEffect(() => {
        let url = layers.addresses.endpoint + `/query?`

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

    }, [attr.parcel_id, setLinked])
    
    useEffect(() => {
        let url = layers.buildings.endpoint + `/query?`

        // TODO: Replace with esri library
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
            <ExplorerFeature {...{attr, attributes,longAttributes, clicked}} />
            {buildings.length > 0 && <BuildingsHere {...{buildings, setClicked}} />}
            {addresses.length > 0 && <AddressesHere {...{addresses, setClicked}} />}
        </>
    )
}

export default ExplorerParcel;