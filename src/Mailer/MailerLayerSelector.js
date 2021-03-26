import simplify from '@turf/simplify'
import {useEffect, useState} from 'react';
import { queryFeatures } from '@esri/arcgis-rest-feature-layer'


const presets = {
  "neighborhoods": {
    name: "Neighborhoods",
    singular: 'neighborhood',
    pickColumn: 'name',
    url: "https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/Neighborhoods/FeatureServer/0/"
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


  return (
    <section className="sidebar-section">
    <h2>Choose from existing boundaries</h2>
    <p>
      Choose your layer, then choose a feature within that layer. For example, the Sherwood Forest neighborhood.
    </p>

    <select className="p-2 m-2" onChange={(e) => setCurrentLayer(e.target.value)} value={currentLayer} >
      <option value=''>Please choose a layer</option>
      {Object.keys(presets).map(l => (
        <option value={l}>{presets[l].name}</option>
      ))}
    </select>

    {layerFeatures.length > 0 && <select className="p-2 m-2" onChange={(e) => {
      let matching = layerFeatures.filter(ft => { return ft.id === parseInt(e.target.value) })
      setCurrentFeature(simplify(matching[0], { tolerance: 0.0001 }))
      setGeom({type: "FeatureCollection", features: [simplify(matching[0], { tolerance: 0.00005 })]})
    }} >
      <option value=''>Please choose a {presets[currentLayer].singular}</option>
      {layerFeatures.map(ft => (
        <option value={ft.id}>{ft.properties[presets[currentLayer].pickColumn]}</option>
      ))}
    </select>}

  </section>
  )
}

export default MailerLayerSelector;