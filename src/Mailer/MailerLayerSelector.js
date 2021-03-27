import simplify from '@turf/simplify'
import {useEffect, useState} from 'react';
import { queryFeatures } from '@esri/arcgis-rest-feature-layer'


const presets = {
  "neighborhoods": {
    name: "Neighborhoods",
    singular: 'neighborhood',
    pickColumn: 'nhood_name',
    url: "https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/Current_City_of_Detroit_Neighborhoods/FeatureServer/0/"
  },
  "cbo": {
    name: "CBOs",
    singular: 'CBO area',
    url: "https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/CBO_Impact_Areas/FeatureServer/0/",
    pickColumn: "Name",
  },
  "historic_districts": {
    name: "Historic Districts",
    singular: 'historic district',
    pickColumn: "Name",
    url: "https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/Detroit_Local_Historic_Districts/FeatureServer/0/"
  }
}

const MailerLayerSelector = ({ geom, setGeom }) => {

  const [currentLayer, setCurrentLayer] = useState('')
  const [layerFeatures, setLayerFeatures] = useState([])
  const [currentFeature, setCurrentFeature] = useState(null)

  useEffect(() => {
    if (currentLayer !== '') {
      queryFeatures({
        url: presets[currentLayer].url,
        geometryPrecision: 5,
        f: 'geojson'
      }).then(d => {
        setLayerFeatures(d.features)
      })
    }
  }, [currentLayer])

  useEffect(() => {
    setCurrentFeature(null)
  }, [geom])

  return (
    <section className="sidebar-section">
    <h2>Choose from existing boundaries</h2>
    <p>
      Choose your layer, then choose a feature within that layer.
    </p>

    <select className="p-2 m-2 text-xs w-1/3" onChange={(e) => {setCurrentLayer(e.target.value); setLayerFeatures([])}} value={currentLayer} >
      <option value=''>Please choose a layer</option>
      {Object.keys(presets).map(l => (
        <option value={l} key={l}>{presets[l].name}</option>
      ))}
    </select>

    {layerFeatures.length > 0 && <select className="p-2 m-2 text-xs" onChange={(e) => {
      let matching = layerFeatures.filter(ft => { return ft.id === parseInt(e.target.value) })
      setCurrentFeature(simplify(matching[0], { tolerance: 0.0001 }))
      setGeom({type: "FeatureCollection", features: [simplify(matching[0], { tolerance: 0.00005 })]})
    }}>
      <option value=''>Please choose a {presets[currentLayer].singular}</option>
      {layerFeatures.map(ft => (
        <option value={ft.id} key={ft.id}>{ft.properties[presets[currentLayer].pickColumn].slice(0,40)}</option>
      ))}
    </select>}

  </section>
  )
}

export default MailerLayerSelector;