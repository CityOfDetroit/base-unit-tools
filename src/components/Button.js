import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Button = ({ text, icon, onClick, disabled=false, active=true, small=false, className='', children}) => {
  return (
    <button 
      className={
        active 
        ? 'flex items-center btn-enabled my-2 px-3 py-2 ' + className 
        : 'flex items-center btn-disabled my-2 px-3 py-2 ' + className} 
        onClick={onClick} 
        disabled={disabled}
    >
      <FontAwesomeIcon className={small ? "text-sm mr-2" : "text-lg mr-2"} icon={icon} />
      {text && <p className={small ? "text-sm" : "text-lg"}>{text}</p>}
      {children}
    </button>
  )
}

export default Button;