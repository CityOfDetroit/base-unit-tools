
import React, { useEffect, useState } from 'react';
import AssignmentFeature from './AssignmentFeature';
import moment from 'moment'
import AnimateHeight from 'react-animate-height';
import { faChevronCircleDown, faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import layers from '../data/layers';

import { queryFeatures } from '@esri/arcgis-rest-feature-layer'

const AssignmentParcel = ({ parcel, setAddresses, setModelAddress, setStreet }) => {

  let attributes = {}

  let [extendedAttribs, setExtendedAttribs] = useState(null)

  let longAttributes = {
  }

  let clicked = { type: 'parcels', id: parcel }

  let [open, setOpen] = useState(false)

  useEffect(() => {
    queryFeatures({
      url: `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/Parcels_2021/FeatureServer/0`,
      where: `parcel_number = '${parcel}'`,
      returnGeometry: false,
      outFields: ['*']
    })
      .then(d => {
        if (d.features.length > 0) {
          let feature = d.features[0]
          setExtendedAttribs(feature.attributes)
        }
      })
  }, [parcel])

  useEffect(() => {
    if (setAddresses) {

      let url = layers.addresses.endpoint + `/query?`
      let params = {
        where: `parcel_id = '${parcel}'`,
        outFields: `*`,
        outSR: 4326,
        f: `pjson`
      }
      let queryString = Object.keys(params).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
      }).join('&');
      console.log(url + queryString)
      fetch(url + queryString)
        .then(r => r.json())
        .then(d => {
          if (Object.keys(d).indexOf('features') > -1) {
            if (d.features.length > 0) {
              setAddresses(d.features.map(f => f.attributes))
              setModelAddress(d.features[0])
              setStreet(d.features[0].attributes.street_id)
            }
            else {
              setAddresses([])
            }
          }
        })
    }
  }, [parcel])

  if (extendedAttribs) {
    extendedAttribs['parcel_id'] = extendedAttribs.parcel_number
    longAttributes['Legal description'] = extendedAttribs.legal_description
    attributes['Parcel address'] = extendedAttribs.address
    attributes['Taxpayer'] = extendedAttribs.taxpayer_1
    attributes['Taxpayer Address'] = `${extendedAttribs.taxpayer_street}, ${extendedAttribs.taxpayer_city}, ${extendedAttribs.taxpayer_state}`
    attributes['Depth x Frontage (ft)'] = `${extendedAttribs.depth} x ${extendedAttribs.frontage}`
  };

  return (
    extendedAttribs && <AssignmentFeature label="Underlying parcel" startOpen {...{ attr: extendedAttribs, attributes, longAttributes, clicked }} />
  )
}

export default AssignmentParcel;