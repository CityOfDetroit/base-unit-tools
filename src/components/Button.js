import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Button = ({ text, icon, onClick, disabled=false, active=true, small=false, className='', children}) => {
  return (
    <button 
      className={
        active 
        ? 'flex items-center my-2 px-3 py-2 bg-blue-300 font-semibold hover:bg-blue-100 ' + className 
        : !disabled 
          ? 'flex items-center my-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 ' + className
          : 'flex items-center my-2 px-3 py-2 bg-blue-100 ' + className} 
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