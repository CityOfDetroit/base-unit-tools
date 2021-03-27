import React, { useEffect, useState } from 'react';
import layers from '../data/layers'

let SERVER_ROOT = `https://opengis.detroitmi.gov/opengis/rest/services/BaseUnits/`

const FeatureDisplay = ({ attributes }) => {
    return (
        <div>
            <table>
            {Object.entries(attributes).map((k) => (
                <tr>
                    <td>{k[0]}</td>
                    <td>{k[1]}</td>
                </tr>
            ))}
            </table>
        </div>
    )
}

const SelectedFeature = ({ featureId, selectedLayer, setSelectedFeature }) => {

    const [data, setData] = useState(null)

    let layer = layers[selectedLayer]
    let url = layer.endpoint

    let params = {
        'where': `${layer.id_column}=${selectedLayer === 'parcels' ? `'${featureId}'` : featureId}`,
        'outFields': '*',
        'resultRecordCount': 1,
        'f': 'json'
    }

    let queryString = Object.keys(params).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
    }).join('&');

    useEffect(() => {
        let fullUrl = SERVER_ROOT + url + `/query?` + queryString
        fetch(fullUrl)
            .then(r => r.json())
            .then(d => {
                if(d.features.length > 0) {
                    setData(d.features[0])
                }
                else {
                    console.log(`No features found for id: ${featureId} at ${fullUrl}`)
                }
        })
    }, [featureId])

    return (
        <div>
            <h1>{selectedLayer}: #{featureId}</h1>
            {data && <FeatureDisplay {...data} />}
        </div>
    )
}

export default SelectedFeature;