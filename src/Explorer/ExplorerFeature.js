import layers from '../data/layers'
import IdBadge from './IdBadge'

const ExplorerFeature = ({ attr, attributes, longAttributes={}, clicked=null }) => {

  // let hasSource = Object.keys(attr).indexOf('geo_source') > -1

  let layer = layers[clicked.type]

  return (
    <>
      <div className="bg-gray-300 p-2 text-xs font-bold flex items-center justify-between" style={{ borderLeft: `8px solid ${layer.color}` }}>
        <h2 className="text-sm md:text-lg">{layer.label}</h2>
        <div className="flex items-center">
          <IdBadge id={attr[layer.id_column]} layer={layer} link={false} />
        </div>      
      </div>
      <section className='sidebar-section' style={{ borderLeft: `8px solid ${layer.color}` }}>
        <table className="w-full">
          <tbody>
            {Object.keys(attributes).map((f, i) => (
              <tr key={i} className={(i + 1 === Object.keys(attributes).length) ? 'h-10' : 'border-b-2 border-gray-400 h-10'}>
                <td className="w-1/3 md:w-2/5 font-bold text-xs md:text-sm">{f}</td>
                <td className="text-xs md:text-sm">{attributes[f]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {Object.keys(longAttributes).length > 0 && Object.keys(longAttributes).map((f,i) => (
          <div key={i} style={{paddingLeft: 2}}>
          <h3 className={i === 0 ? 'border-t-2 border-gray-400 text-xs md:text-sm py-2' : 'text-xs md:text-sm py-2'}>
            {f}
          </h3>
          <p className="px-1 md:px-2 text-xs md:text-sm leading-tight"> {longAttributes[f]}</p>
          </div>

        ))}
      </section>
    </>
  )
}

export default ExplorerFeature;