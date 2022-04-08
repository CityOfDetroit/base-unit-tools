import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'

const CopyValue = ({ value, className=null }) => {
  return (
    <FontAwesomeIcon
      icon={faCopy}
      className={className ? className : "text-gray-400 hover:text-gray-500"}
      onClick={() => navigator.clipboard.writeText(value)}
    />
  );
};

export default CopyValue;