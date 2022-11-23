import Tooltip from '@mui/material/Tooltip';

const CustomTooltip = ({ children, title }) => {
    return (
      <Tooltip title={title} placement="top">
        <div>
          {children}
        </div>
      </Tooltip>
    );
  };
  
export default CustomTooltip;