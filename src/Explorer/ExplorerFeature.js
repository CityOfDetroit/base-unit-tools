import layers from '../data/layers'
import IdBadge from './IdBadge'

const ExplorerFeature = ({ attr, attributes, longAttributes={}, clicked }) => {

  // let hasSource = Object.keys(attr).indexOf('geo_source') > -1

  let layer = layers[clicked.type]

  console.log(layer)

  return (
    <>
      <div className="bg-gray-300 p-2 text-xs font-bold flex items-center justify-between" style={{ borderLeft: `8px solid ${layer.color}` }}>
        <h2>{layer.label}</h2>
        <div className="flex items-center">
          {/* {hasSource && <span className="font-semibold text-gray-500 bg-gray-300 py-1 px-2 mx-3 text-sm">{attr.geo_source}</span>} */}
          <IdBadge id={attr[layer.id_column]} layer={layer} link={false} />
          {/* <pre className="font-bold" style={{background: '#feb70d'}}>{clicked.type === 'parcels' ? null : `#`}{attr[layer.id_column]}</pre> */}
        </div>      
      </div>
      <section className='sidebar-section' style={{ borderLeft: `8px solid ${layer.color}` }}>
        <table className="w-full">
          <tbody>
            {Object.keys(attributes).map((f, i) => (
              <tr key={i} className={(i + 1 === Object.keys(attributes).length) ? 'h-10' : 'border-b-2 border-gray-400 h-10'}>
                <td className="w-2/5 font-bold text-sm">{f}</td>
                <td className="">{attributes[f]}</td>
              </tr>

            ))}
          </tbody>
        </table>
        {Object.keys(longAttributes).length > 0 && Object.keys(longAttributes).map((f,i) => (
          <div key={i}>
          <h3 className={i === 0 ? 'border-t-2 border-gray-400 text-sm py-2' : 'text-sm py-2'}>
            {f}
          </h3>
          <p className="px-2 text-sm"> {longAttributes[f]}</p>
          </div>

        ))}
      </section>
    </>
  )
}

export default ExplorerFeature;