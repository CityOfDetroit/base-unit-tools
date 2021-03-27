import layers from '../data/layers'
import IdBadge from './IdBadge'

const ExplorerFeature = ({ attr, attributes, clicked }) => {

  let hasSource = Object.keys(attr).indexOf('geo_source') > -1

  let layer = layers[clicked.type]

  return (
    <>
      <section className='sidebar-section feature' style={{ borderLeft: `8px solid ${layer.color}` }}>
        <div className="flex items-center justify-between mb-2 text-lg">
          <h2>{layer.label}</h2>
          <div className="flex items-center">
            {/* {hasSource && <span className="font-semibold text-gray-500 bg-gray-300 py-1 px-2 mx-3 text-sm">{attr.geo_source}</span>} */}
            <IdBadge id={attr[layer.id_column]} layer={layer} link={false} />
            {/* <pre className="font-bold" style={{background: '#feb70d'}}>{clicked.type === 'parcels' ? null : `#`}{attr[layer.id_column]}</pre> */}
          </div>
        </div>
        <table className="w-full">
          <tbody>
            {Object.keys(attributes).map((f, i) => (
              <tr key={i} className={i < Object.keys(attributes).length - 1 ? 'border-b-2 border-gray-400 h-10' : 'h-10'}>
                <td className="w-1/2 font-bold text-sm">{f}</td>
                <td className="">{attributes[f]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}

export default ExplorerFeature;