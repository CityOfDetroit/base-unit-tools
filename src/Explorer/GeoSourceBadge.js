
import layers from '../data/layers.json';

const GeoSourceBadge = ({ layer }) => {

    let lyr = layers[layer+'s']
    return (
        <span className="font-semibold text-gray-500 bg-gray-300 py-1 px-2 ml-2 text-xs">{layer}</span>
    )
}

export default GeoSourceBadge;