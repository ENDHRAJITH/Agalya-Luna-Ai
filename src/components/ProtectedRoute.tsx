import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-void)' }}>
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border border-[var(--accent-luna)] opacity-30 animate-ping" />
          <div className="absolute inset-2 rounded-full border border-[var(--accent-cyan)] animate-spin" style={{ borderTopColor: 'transparent' }} />
        </div>
      </div>
    )
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}
