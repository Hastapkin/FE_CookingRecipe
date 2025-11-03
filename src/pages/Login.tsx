// React import not required with react-jsx runtime
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('trung@example.com')
  const [password, setPassword] = useState('trung1234')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    // Simulate login
    await new Promise(r => setTimeout(r, 800))
    if (email && password) {
      const nameGuess = email.split('@')[0]
      localStorage.setItem('user', JSON.stringify({ name: nameGuess, email }))
      window.location.href = '/'
    } else {
      setStatus('error')
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
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              {status === 'error' && (
                <div className="form-error">
                  <i className="fas fa-exclamation-circle"></i>
                  <span>Invalid credentials</span>
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
            <div style={{marginTop:'8px', fontSize:12, color:'#6B7280'}}>
              Demo: demo@example.com / demo1234
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Login


