import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const SectionSubhead = ({ title, subtitle, icon, children }) => {
  return (
    <div className="flex justify-start items-center mb-2 mt-4">
    <FontAwesomeIcon icon={icon} className="mr-3 text-xl" />
    <div>
      <h3 className="text-base font-semibold text-gray-700">{title}</h3>
      <h3 className="text-sm font-normal text-gray-700">{subtitle}</h3>
    </div>
  </div>
  )
}

export default SectionSubhead