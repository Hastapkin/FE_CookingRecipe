// React import not required with react-jsx runtime
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('Demo User')
  const [email, setEmail] = useState('trung@example.com')
  const [password, setPassword] = useState('trung1234')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    await new Promise(r => setTimeout(r, 800))
    setStatus('success')
    localStorage.setItem('user', JSON.stringify({ name, email }))
    setTimeout(() => navigate('/'), 800)
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
                <label htmlFor="name">Full Name</label>
                <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              {status === 'success' && (
                <div className="form-success">
                  <i className="fas fa-check-circle"></i>
                  <span>Registration successful! Redirecting to login...</span>
                </div>
              )}
              <button type="submit" className="btn btn-primary btn-large" disabled={status==='loading'}>
                {status==='loading' ? 'Creating account...' : 'Create Account'}
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
            <p style={{marginTop:'16px'}}>Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Register


