import { faQuestion, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FormField = ({ title = "Title", width = "auto", children }) => {
  return (
    <div className={`flex flex-col w-${width}`}>
      <div className="flex items-center justify-between py-1 px-2 bg-blue-100">
        <span className="text-xs font-semibold text-gray-500">{title}</span>
        {/* <FontAwesomeIcon icon={faQuestionCircle} size="xs" color="gray" /> */}
      </div>
      {children}
    </div>
  )
}

export default FormField;