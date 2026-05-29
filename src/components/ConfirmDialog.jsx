import { Dialog, DialogContent, DialogActions, Button } from '@mui/material'

export default function ConfirmDialog({ open, content, onConfirm, onCancel }) {
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogContent>
                <p>{content}</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="primary">
                    Cancel
                </Button>
                <Button onClick={onConfirm} color="secondary" variant="contained">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    )
}