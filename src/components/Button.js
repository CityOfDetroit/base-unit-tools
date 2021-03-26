import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Button = ({ text, icon, onClick, disabled=false, active=true}) => {
  return (
    <button className={active ? 'flex items-center btn-enabled my-2' : 'flex items-center btn-disabled my-2'} onClick={onClick} disabled={disabled}>
      <FontAwesomeIcon className="text-lg mr-2" icon={icon} />
      <p>{text}</p>
    </button>
  )
}

export default Button;