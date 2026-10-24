import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ background: 'var(--bg)', height: '100vh' }} className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div style={{ background: 'var(--gold)', borderRadius: 10 }} className="w-10 h-10 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="var(--bg)">
              <path d="M3 3h14v2H3V3zm0 4h10v2H3V7zm0 4h14v2H3v-2zm0 4h8v2H3v-2z"/>
            </svg>
          </div>
          <div className="flex gap-1.5">
            <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
          </div>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  return children
}
