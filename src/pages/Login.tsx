// React import not required with react-jsx runtime
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login, saveUserSession } from '../services/auth'

function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')
    
    try {
      const response = await login(username, password)
      if (response.success && response.token) {
        saveUserSession(response.user, response.token)
        navigate('/')
      } else {
        setStatus('error')
        setErrorMessage('Login failed. Please check your credentials.')
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Login failed. Please try again.')
    }
  }

  const handleGoogle = () => {
    // Placeholder for Google OAuth
    window.location.href = '/api/auth/google'
  }

  return (
    <main>
      <section className="page-header">
      </section>

      <section className="contact-content">
        <div className="container" style={{maxWidth: '640px'}}>
          <div className="contact-form-section">
            <div className="section-tag center">Welcome back</div>
            <h2 style={{textAlign: 'center'}}>Sign in to your account</h2>
            <form onSubmit={handleSubmit} className="contact-form" style={{marginTop: '1rem'}}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              {status === 'error' && (
                <div className="form-error">
                  <i className="fas fa-exclamation-circle"></i>
                  <span>{errorMessage || 'Invalid credentials'}</span>
                </div>
              )}
              <button type="submit" className="btn btn-primary btn-large" disabled={status==='loading'}>
                {status==='loading' ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <div style={{display:'flex', alignItems:'center', gap:'12px', margin:'16px 0'}}>
              <div style={{height:1, background:'#E5E7EB', flex:1}}></div>
              <span style={{color:'#6B7280', fontSize:14}}>or</span>
              <div style={{height:1, background:'#E5E7EB', flex:1}}></div>
            </div>
            <button className="btn btn-outline" onClick={handleGoogle}>
              <i className="fab fa-google"></i> Continue with Google
            </button>
            <p style={{marginTop:'16px'}}>Don't have an account? <Link to="/register">Register</Link></p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Login


