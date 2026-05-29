import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Analytics from './pages/Analytics.jsx'
import ExpenseLogs from './pages/ExpenseLogs.jsx'
import AddEditTransaction from './pages/AddEditTransaction.jsx'
import Sidebar from './components/Sidebar.jsx'
import { Box } from '@mui/material'
import Login from './pages/Login.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
              <Sidebar />
              <Box component="main" 
                sx={{ flex: 1, overflowY: 'auto', height: '100vh', minWidth: 0, }}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/transactions" element={<AddEditTransaction />} />
                  <Route path="/transactions/:id" element={<AddEditTransaction />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/expense-logs" element={<ExpenseLogs />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Box>
            </Box>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App