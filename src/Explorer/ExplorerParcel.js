
import React, { useEffect, useState } from 'react';
import layers from '../data/layers';
import AddressesHere from './AddressesHere';
import BuildingsHere from './BuildingsHere';
import ExplorerFeature from './ExplorerFeature';
import moment from 'moment'

import { queryFeatures } from '@esri/arcgis-rest-feature-layer'

const ExplorerParcel = ({ feature, clicked, setClicked, linked, setLinked }) => {

    let { attributes: attr } = feature;

    let attributes = {
        "Parcel address": attr.assessor_address,
        "Assessor's property class": attr.propclassdesc,
        "Taxable status": attr.taxstatus
    }

    let longAttributes = {
    }

    let [addresses, setAddresses] = useState([])
    let [buildings, setBuildings] = useState([])
    let [extendedAttribs, setExtendedAttribs] = useState(null)

    useEffect(() => {

      queryFeatures({
        url: `https://opengis.detroitmi.gov/opengis/rest/services/Assessors/Parcels/FeatureServer/0`,
        where: `parcel_number = '${attr.parcel_id}'`,
        returnGeometry: false,
        outFields: ['*']
      })
        .then(d => {
          if(d.features.length > 0) {
            let feature = d.features[0]
            setExtendedAttribs(feature.attributes)
          }
        })
    }, [attr.parcel_id])

    if(extendedAttribs) {
      console.log(extendedAttribs)
      longAttributes['Legal description'] = extendedAttribs.legal_description
      attributes['Taxpayer'] = extendedAttribs.taxpayer_1
      extendedAttribs.taxpayer_2 && (attributes['Taxpayer (ext)'] = extendedAttribs.taxpayer_2)
      attributes['Taxpayer Address'] = `${extendedAttribs.taxpayer_street}, ${extendedAttribs.taxpayer_city}, ${extendedAttribs.taxpayer_state}`
      extendedAttribs.sale_date && (attributes['Sale Date'] = moment(extendedAttribs.sale_date).format("LL"))
      extendedAttribs.sale_date && (attributes['Sale Price'] = parseInt(extendedAttribs.sale_price).toLocaleString())
      attributes['PRE %'] = extendedAttribs.homestead_pre
      extendedAttribs.nez && (attributes['NEZ'] = extendedAttribs.nez)
      attributes['Is Improved?'] = extendedAttribs.is_improved === "1" ? `Yes` : `No`
      attributes['Property Class'] = `${extendedAttribs.property_class} - ${extendedAttribs.property_class_desc}`
      attributes['Property Use'] = `${extendedAttribs.use_code} - ${extendedAttribs.use_code_desc}`
      extendedAttribs.total_floor_area && (attributes['Total Floor Area'] = `${extendedAttribs.total_floor_area}`)
      extendedAttribs.style && (attributes['Style'] = `${extendedAttribs.style}`)
      attributes['Tax Status'] = extendedAttribs.tax_status
      attributes['Assessed Value'] = parseInt(extendedAttribs.assessed_value).toLocaleString()
      attributes['Taxable Value'] = parseInt(extendedAttribs.taxable_value).toLocaleString()
      attributes['Total Acreage'] = extendedAttribs.total_acreage
      attributes['Total Square Footage'] = extendedAttribs.total_square_footage
      attributes['Depth x Frontage (ft)'] = `${extendedAttribs.depth} x ${extendedAttribs.frontage}`


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