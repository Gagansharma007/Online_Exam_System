import { Dialog, Button, DialogTitle, DialogActions, DialogContentText, DialogContent } from "@mui/material";
const StartTest = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
    <DialogTitle>{"Start Test?"}</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to take the test? It will switch to full-screen mode.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">No</Button>
      <Button onClick={onConfirm} color="primary" autoFocus>Yes</Button>
    </DialogActions>
  </Dialog>
  )
}

export default StartTest;