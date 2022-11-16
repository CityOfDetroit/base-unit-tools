import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const SimpleDialog = ({title, message, onClose, open}) => {
  
    return (
      <Dialog onClose={onClose} open={open}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
              {message}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    );
  }

  export default SimpleDialog;