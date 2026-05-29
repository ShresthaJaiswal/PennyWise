import { NavLink } from 'react-router-dom'
import { Box, Typography, Tooltip } from '@mui/material'
import { useState, useEffect, useRef } from 'react'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import LogoutIcon from '@mui/icons-material/Logout'
import { useDispatch } from 'react-redux'
import { clearCredentials } from '../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { useTheme, useMediaQuery } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import BarChartIcon from '@mui/icons-material/BarChart'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'

const navItems = [
    { label: 'Dashboard', path: '/', icon: <DashboardIcon fontSize="small" /> },
    { label: 'Add/Edit Transaction', path: '/transactions', icon: <AddCircleOutlineIcon fontSize="small" /> },
    { label: 'Analytics', path: '/analytics', icon: <BarChartIcon fontSize="small" /> },
    { label: 'Expense Logs', path: '/expense-logs', icon: <ReceiptLongIcon fontSize="small" /> },
]

export default function Sidebar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const [collapsed, setCollapsed] = useState(isMobile)

    const isMountedRef = useRef(false)
    useEffect(() => {
        if (isMountedRef.current) {
            setCollapsed(isMobile)
        } else {
            isMountedRef.current = true
        }
    }, [isMobile])

    return (
        <Box
            component="aside"
            sx={{
                width: collapsed ? 52 : 220,
                transition: 'width 0.3s ease',
                flexShrink: 0,
                height: '100vh', bgcolor: '#031525', color: 'white', display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}>

            <Box sx={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', px: collapsed ? 0.5 : 2, borderBottom: '1px solid #1e3a5f', flexShrink: 0 }}>

                {!collapsed &&
                    <Typography variant="body1" fontWeight="bold" noWrap sx={{ fontSize: 15 }}>
                        PennyWise
                    </Typography>}
                <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ color: 'white', p: 0.5 }}>
                    <ChevronLeftIcon sx={{ fontSize: 20, transform: collapsed ? 'rotate(180deg)' : 'none', transition: '0.3s', color: 'white' }} />
                </IconButton>
            </Box>

            <Box sx={{ flex: 1, px: 1, py: 2, display: 'flex', flexDirection: 'column', gap: 1, overflow: 'hidden' }}>
                {navItems.map(({ label, path, icon }) => (
                    <Tooltip key={path} title={collapsed ? label : ''} placement="right">
                        <Box>
                            <NavLink
                                to={path}
                                style={{ textDecoration: 'none', display: 'block' }}
                            >
                                {({ isActive }) => (
                                    <Box
                                        sx={{
                                            px: collapsed ? 0 : 1.5,
                                            py: 1,
                                            mx: 0.5,
                                            my: 0.25,
                                            borderRadius: 2,
                                            fontSize: 14,
                                            fontWeight: 500,
                                            color: isActive ? 'white' : '#cbd5e1',
                                            bgcolor: isActive ? '#0e7490' : 'transparent',
                                            whiteSpace: 'nowrap',
                                            display: 'flex',
                                            alignItems: 'center', gap: collapsed ? 0 : 1.5,
                                            justifyContent: collapsed ? 'center' : 'flex-start',
                                            overflow: 'hidden', textOverflow: 'ellipsis',
                                            '&:hover': {
                                                bgcolor: '#082f49',
                                            },
                                        }}>
                                        <Box sx={{ flexShrink: 0, display: 'flex' }}>{icon}</Box>
                                        {!collapsed && (
                                            <Typography sx={{
                                                fontSize: 13,
                                                fontWeight: 500,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}>
                                                {label}
                                            </Typography>
                                        )}
                                    </Box>
                                )}
                            </NavLink>
                        </Box>
                    </Tooltip>
                ))}
            </Box>

            <Tooltip title={collapsed ? 'Logout' : ''} placement="right">
                <Box onClick={() => { dispatch(clearCredentials()); navigate('/login') }}
                    sx={{
                        display: 'flex', alignItems: 'center',
                        gap: collapsed ? 0 : 1.5,
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        px: collapsed ? 0 : 1.5, py: 1, mx: 0.5, mb: 1,
                        borderRadius: 1.5, color: '#94a3b8', cursor: 'pointer',
                        borderTop: '1px solid #1e3a5f',
                        '&:hover': { bgcolor: '#0f2942', color: 'white' },
                        transition: 'all 0.15s',
                    }}>
                    <LogoutIcon sx={{ fontSize: 18, flexShrink: 0 }} />
                    {!collapsed && <Typography sx={{ fontSize: 13, fontWeight: 500 }}>Logout</Typography>}
                </Box>
            </Tooltip>
        </Box>
    )
}