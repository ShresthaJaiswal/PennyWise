import { useForm, Controller } from 'react-hook-form'
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, FormHelperText, Box } from '@mui/material'


export default function TransactionForm({ types, categories, defaultValues, onSubmit, isLoading }) {

    const { register, handleSubmit, control, formState: { errors }} = useForm({
        values: defaultValues || { type: '', category: '', amount: '', description: '' }
    })

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>

            <FormControl fullWidth error={!!errors.type}>
                <InputLabel id="type-label">Type</InputLabel>
                <Controller
                    name="type"
                    control={control}
                    rules={{ required: 'Type is required' }}
                    render={({ field }) => (
                        <Select labelId="type-label" label="Type" {...field}>
                            {types.map((t) => (
                                <MenuItem key={t.id} value={t.name}>{t.name}</MenuItem>
                            ))}
                        </Select>
                    )}
                />
                <FormHelperText>{errors.type?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth error={!!errors.category}>
                <InputLabel id="category-label">Category</InputLabel>
                <Controller
                    name="category"
                    control={control}
                    rules={{ required: 'Category is required' }}
                    render={({ field }) => (
                        <Select labelId="category-label" label="Category" {...field}>
                            {categories.map((c) => (
                                <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>
                            ))}
                        </Select>
                    )}
                />
                <FormHelperText>{errors.category?.message}</FormHelperText>
            </FormControl>

            <TextField label="Amount" type="number"
                {...register('amount', {
                    required: 'Amount is required',
                    valueAsNumber: true,
                    min: {
                        value: 0.01, message: 'Amount must be positive'
                    },
                    validate: value => !isNaN(value) || 'Amount must be a number'
                })}
                error={!!errors.amount}
                helperText={errors.amount?.message}
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }} />

            <TextField label="Description"
                {...register('description', { required: 'Description is required' })}
                error={!!errors.description} helperText={errors.description?.message}
                multiline
                rows={3}
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }} />


            <Button type="submit" variant="contained" color="primary" size="large" sx={{ py: 1.5 }}>
                {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
        </Box >
    )
}