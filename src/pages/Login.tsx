// React import not required with react-jsx runtime
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login, saveUserSession } from '../services/auth'

function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
                <div style={{position: 'relative'}}>
                  <input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                    style={{paddingRight: '40px'}}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#6B7280',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                  </button>
                </div>
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
            <p style={{marginTop:'16px'}}>Don't have an account? <Link to="/register">Register</Link></p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Login


