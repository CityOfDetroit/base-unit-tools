import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Button = ({ text, icon, onClick, disabled=false, active=true, small=false, className='', children}) => {
  return (
    <button 
      className={
        active 
        ? 'flex items-center px-3 py-2 bg-blue-300 font-bold hover:bg-blue-100 ' + className 
        : !disabled 
          ? 'flex items-center px-3 py-2 text-gray-600 font-semibold bg-blue-200 hover:bg-blue-200 ' + className
          : 'flex items-center px-3 py-2 text-gray-400 bg-blue-200 ' + className} 
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