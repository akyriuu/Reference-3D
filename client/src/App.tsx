import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthProvider'
import { LoginPage } from './auth/LoginPage'
import { Studio } from './studio/Studio'

function Gate({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth()
  if (!ready) return <div className="login-boot">abrindo o estúdio…</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <Gate>
                <Studio />
              </Gate>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}