import { faArrowAltCircleRight, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CopyValue from "../../src/components/CopyValue";
import { useRouter } from "next/router";

const IdBadge = ({ layer, id, link = true, copy = false }) => {

  let router = useRouter();

  return (
    <div
      className="flex items-center text-xs md:text-sm px-2"
      style={{ background: layer.color, color: layer.text_color }}
    >
      <pre
        className="font-bold flex items-center py-1"
        style={{ background: layer.color, color: layer.text_color }}
      >
        {layer.label === "Parcel" ? null : `#`}
        {id}
        {link && (
          <FontAwesomeIcon
            icon={faArrowAltCircleRight}
            className="ml-2 text-lg"
            onClick={() => router.push(`/map?id=${id}&type=${layer.name}`)}
          />
        )}
        {copy && <CopyValue value={id} className="ml-1" />}
      </pre>
    </div>
  );
};

export default IdBadge;
