import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import Dashboard from './pages/Dashboard'
import './index.css'
import { AuthProvider, useAuth } from './context/AuthContext'

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center text-neutral-300">Loading…</div>
  if (!user) return <Navigate to="/" replace />
  return children
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)
