import Tooltip from '@mui/material/Tooltip';

const CustomTooltip = ({ children, title }) => {
    return (
      <Tooltip title={title} placement="top">
        {children}
      </Tooltip>
    );
  };
  
export default CustomTooltip;