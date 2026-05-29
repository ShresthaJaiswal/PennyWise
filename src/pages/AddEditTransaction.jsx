import TransactionForm from "../components/TransactionForm";
import { Box, Typography } from "@mui/material";
import { useToast } from "../hooks/useToast";
import { useParams } from "react-router-dom";
import { useGetTransactionByIdQuery, useAddTransactionMutation, useUpdateTransactionMutation, useGetTypesQuery, useGetCategoriesQuery } from "../store/api";
import { useSelector } from "react-redux";

const generateId = () => Date.now() + Math.random().toString(36).slice(2, 8)

export default function AddEditTransaction() {
    const user = useSelector(state => state.auth.user)

    const [addTransaction, { isAdding }] = useAddTransactionMutation()
    const [editTransaction, { isUpdating }] = useUpdateTransactionMutation()

    const { id } = useParams();
    const { data: existing } = useGetTransactionByIdQuery(id, { skip: !id });
    const { data: types = [] } = useGetTypesQuery()
    const { data: categories = [] } = useGetCategoriesQuery()

    const { addToast } = useToast()

    const onSubmit = async (data) => {
        try {
            if (existing) {
                await editTransaction({
                    id: existing.id,
                    ...data,
                    amount: Number(data.amount)
                }).unwrap()
                addToast('Transaction updated successfully!', 'success')
            } else {
                await addTransaction({
                    ...data,
                    amount: Number(data.amount),
                    createdAt: new Date().toISOString().split('T')[0],
                    status: 1,
                    userId: user.id,
                    id: generateId()
                }).unwrap()
                addToast('Transaction added successfully!', 'success')
            }
        } catch (error) {
            console.error('Error adding transaction:', error)
            addToast('Something went wrong.', 'error')
        }
    }

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: { xs: 4, md: 3 }, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" gutterBottom mb={3}>
                {existing ? 'Edit Transaction' : 'Add Transaction'}
            </Typography>
            <TransactionForm types={types} categories={categories} defaultValues={existing} onSubmit={onSubmit} isLoading={isAdding || isUpdating} />
        </Box>
    );
}