import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Button = ({ text, icon, onClick, disabled=false}) => {
  return (
    <button className='flex items-center btn-enabled my-2' onClick={onClick}>
      <FontAwesomeIcon className="text-lg mr-2" icon={icon} />
      <p>{text}</p>
    </button>
  )
}

export default Button;