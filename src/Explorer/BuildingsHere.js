import layers from '../data/layers'
import IdBadge from './IdBadge'

const BuildingsHere = ({ buildings, setClicked }) => {

  buildings = buildings.sort((a, b) => b.semcog_build_type - a.semcog_build_type < -1)

  return (
    <section className='sidebar-section' style={{ borderLeft: `8px solid ${layers['buildings'].color}` }} >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm md:text-base">{buildings.length} linked building{buildings.length > 1 ? `s:` : `:`}</h2>
      </div>
      {buildings.map((b, i) => (
        <div 
          key={b.bldg_id} 
          className={i + 1 < buildings.length ? 
                      "py-1 flex items-center justify-between border-b-2 text-sm md:text-base" : 
                      "text-sm md:text-base py-1 flex items-center justify-between"}
        >
          <span className="text-xs md:text-base">{b.ted_build_type}</span>
          <IdBadge id={b.bldg_id} layer={layers["buildings"]} setClicked={setClicked} link />
        </div>
      ))}
    </section>
  )
}

export default BuildingsHere;