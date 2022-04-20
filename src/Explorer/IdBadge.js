import { faArrowAltCircleRight, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CopyValue from "../components/CopyValue";

const IdBadge = ({ layer, id, link=true, copy=false, setClicked }) => {

    return (
        <div className="flex items-center text-xs md:text-sm px-2" style={{background: layer.color, color: layer.text_color}}>
            <pre className="font-bold flex items-center py-1" style={{background: layer.color, color: layer.text_color}} >{layer.label === 'Parcel' ? null : `#`}
                {id}
                {link && <FontAwesomeIcon icon={faArrowAltCircleRight} className="ml-2 text-lg" onClick={() => setClicked({type: layer.name, id: id})} />}
                {copy && <CopyValue value={id} className="ml-1" />}
            </pre>
        </div>
    )
}

export default IdBadge;