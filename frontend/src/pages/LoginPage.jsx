import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/app')
    } catch (err) {
      setError(friendlyError(err.code))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle()
      navigate('/app')
    } catch (err) {
      setError(friendlyError(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }} className="flex flex-col">

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid var(--border)' }} className="px-6 py-4 flex items-center">
        <Link to="/" className="flex items-center gap-2.5">
          <div style={{ background: 'var(--gold)', borderRadius: 8 }} className="w-7 h-7 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="var(--bg)">
              <path d="M3 3h14v2H3V3zm0 4h10v2H3V7zm0 4h14v2H3v-2zm0 4h8v2H3v-2z"/>
            </svg>
          </div>
          <span className="font-serif text-lg" style={{ color: 'var(--gold2)' }}>Memex</span>
        </Link>
      </nav>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm fade-up">
          <h1 className="font-serif text-2xl mb-1 text-center" style={{ color: 'var(--text)' }}>Welcome back</h1>
          <p className="text-sm text-center mb-8" style={{ color: 'var(--text3)' }}>Sign in to your knowledge base</p>

          {/* Google */}
          <button onClick={handleGoogle} disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl text-sm mb-4 transition-all"
            style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--text3)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border2)'}>
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs" style={{ color: 'var(--text3)' }}>or email</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text3)' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required className="input-base w-full" />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text3)' }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required className="input-base w-full" />
            </div>

            {error && (
              <div className="text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(196,98,45,.15)', color: 'var(--rust)', border: '1px solid rgba(196,98,45,.3)' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-gold py-2.5 mt-1"
              style={{ opacity: loading ? .7 : 1 }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-xs text-center mt-6" style={{ color: 'var(--text3)' }}>
            No account?{' '}
            <Link to="/signup" style={{ color: 'var(--gold2)' }} className="hover:underline">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

function friendlyError(code) {
  const map = {
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/too-many-requests': 'Too many attempts. Try again later.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
  }
  return map[code] || 'Something went wrong. Please try again.'
}
