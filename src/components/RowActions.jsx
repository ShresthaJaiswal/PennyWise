import ConfirmDialog from "./ConfirmDialog";
import { Menu, MenuItem, IconButton } from "@mui/material";
import { useState } from "react";
import { useDeleteTransactionMutation } from "../store/api";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from "react-router-dom";

export default function RowActions({ transactionId }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const [deleteTransaction] = useDeleteTransactionMutation();

    const navigate = useNavigate();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleMenuClose = () => {
        setAnchorEl(null);
    }

    const handleEditClick = () => {
        navigate(`/transactions/${transactionId}`);
    }

    const handleDeleteClick = () => {
        setConfirmOpen(true);
        handleMenuClose();
    }

    const handleConfirmDelete = () => {
        try {
            deleteTransaction(transactionId);
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
        setConfirmOpen(false);
    }

    return (
        <>
            <IconButton onClick={handleMenuOpen} size="small">
                <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => { handleEditClick(); handleMenuClose(); }}>Edit</MenuItem>
                <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
            </Menu>
            <ConfirmDialog
                open={confirmOpen}
                content="Are you sure you want to delete this transaction?"
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}