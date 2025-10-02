import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import Dashboard from './pages/Dashboard'
import StudentDashboard from './pages/StudentDashboard'
import './index.css'
import { AuthProvider, useAuth } from './context/AuthContext'

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center text-neutral-300">Loading…</div>
  if (!user) return <Navigate to="/" replace />
  return children
}

function RequireAdmin({ children }: { children: JSX.Element }) {
  const { user, profile, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center text-neutral-300">Loading…</div>
  if (!user) return <Navigate to="/" replace />
  if (profile?.role !== 'admin') return <Navigate to="/student" replace />
  return children
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/student" element={<RequireAuth><StudentDashboard /></RequireAuth>} />
          <Route path="/dashboard" element={<RequireAdmin><Dashboard /></RequireAdmin>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)
