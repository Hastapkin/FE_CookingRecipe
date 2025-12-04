// React import not required with react-jsx runtime
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register, saveUserSession } from '../services/auth'

function Register() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('idle')
    setErrorMessage('')
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setStatus('error')
      setErrorMessage('Passwords do not match. Please try again.')
      return
    }
    
    setStatus('loading')
    
    try {
      const response = await register(username, password)
      if (response.success && response.token) {
        setStatus('success')
        saveUserSession(response.user, response.token)
        setTimeout(() => {
          navigate('/')
        }, 1000)
      } else {
        setStatus('error')
        setErrorMessage('Registration failed. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Registration failed. Username may already exist.')
    }
  }

  const handleGoogle = () => {
    window.location.href = '/api/auth/google'
  }

  return (
    <main>
      <section className="page-header">
      </section>

      <section className="contact-content">
        <div className="container" style={{maxWidth: '640px'}}>
          <div className="contact-form-section">
            <div className="section-tag center">Join us</div>
            <h2 style={{textAlign: 'center'}}>Create an account</h2>
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
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div style={{position: 'relative'}}>
                  <input 
                    id="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    required 
                    style={{paddingRight: '40px'}}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    <i className={showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                  </button>
                </div>
              </div>
              {status === 'success' && (
                <div className="form-success">
                  <i className="fas fa-check-circle"></i>
                  <span>Registration successful! Redirecting...</span>
                </div>
              )}
              {status === 'error' && (
                <div className="form-error">
                  <i className="fas fa-exclamation-circle"></i>
                  <span>{errorMessage || 'Registration failed'}</span>
                </div>
              )}
              <button type="submit" className="btn btn-primary btn-large" disabled={status==='loading'}>
                {status==='loading' ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
            <p style={{marginTop:'16px'}}>Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Register


