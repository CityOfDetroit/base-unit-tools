
import React, { useEffect, useState } from 'react';
import AssignmentFeature from './AssignmentFeature';
import moment from 'moment'

import { queryFeatures } from '@esri/arcgis-rest-feature-layer'

const AssignmentParcel = ({ parcel }) => {

    let attributes = {}

    let [extendedAttribs, setExtendedAttribs] = useState(null)

    let longAttributes = {
    }

    let clicked = { type: 'parcels', id: parcel }


    useEffect(() => {

      queryFeatures({
        url: `https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/Parcels_2021/FeatureServer/0`,
        where: `parcel_number = '${parcel}'`,
        returnGeometry: false,
        outFields: ['*']
      })
        .then(d => {
          if(d.features.length > 0) {
            let feature = d.features[0]
            setExtendedAttribs(feature.attributes)
          }
        })
    }, [parcel])

    if(extendedAttribs) {
      extendedAttribs['parcel_id'] = extendedAttribs.parcel_number
      longAttributes['Legal description'] = extendedAttribs.legal_description
      attributes['Parcel address'] = extendedAttribs.address
      attributes['Taxpayer'] = extendedAttribs.taxpayer_1
      attributes['Taxpayer Address'] = `${extendedAttribs.taxpayer_street}, ${extendedAttribs.taxpayer_city}, ${extendedAttribs.taxpayer_state}`
      attributes['Depth x Frontage (ft)'] = `${extendedAttribs.depth} x ${extendedAttribs.frontage}`
    };

    return (
      extendedAttribs && <AssignmentFeature label="Underlying parcel" {...{attr: extendedAttribs, attributes, longAttributes, clicked}} />
    )
}

export default AssignmentParcel;