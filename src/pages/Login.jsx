import { useForm } from 'react-hook-form'
import { Box, Button, TextField, Typography, Tabs, Tab } from '@mui/material'
import { useState } from 'react'
import { useLoginMutation, useRegisterMutation } from '../store/api'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const [tab, setTab] = useState(0)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [login, { isLoading: isLoggingIn }] = useLoginMutation()
    const [register, { isLoading: isRegistering }] = useRegisterMutation()

    const { register: rhfRegister, handleSubmit, formState: { errors }, setError } = useForm()

    const onSubmit = async (data) => {
        try {
            const result = tab === 0
                ? await login({ email: data.email, password: data.password }).unwrap()
                : await register({ email: data.email, password: data.password }).unwrap()

            dispatch(setCredentials({ user: result.user, token: result.accessToken }))
            navigate('/')
        } catch (error) {
            console.error('Authentication error:', error)
            setError('root', { message: tab === 0 ? 'Invalid email or password' : 'Registration failed' })
        }
    }

    return (
        <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#031525' }}>
            <Box sx={{ width: 400, p: 4, borderRadius: 3, bgcolor: 'white', boxShadow: 6 }}>
                <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">PennyWise</Typography>

                <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ mb: 3 }}>
                    <Tab label="Login" />
                    <Tab label="Register" />
                </Tabs>

                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Email"
                        type="email"
                        {...rhfRegister('email', { required: 'Email is required' })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        {...rhfRegister('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                    {errors.root && <Typography color="error" variant="body2">{errors.root.message}</Typography>}
                    <Button type="submit" variant="contained" size="large" sx={{ mt: 1 }}>
                        {isLoggingIn || isRegistering ? 'Please wait...' : tab === 0 ? 'Login' : 'Register'}
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}