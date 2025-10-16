// React import not required with react-jsx runtime
import { useState } from 'react'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    newsletter: false
  })

  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('sending')
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setFormStatus('success')
    
    // Reset form after success
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        newsletter: false
      })
      setFormStatus('idle')
    }, 3000)
  }

  return (
    <main>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Contact Us</h1>
          <p className="page-subtitle">We'd love to hear from you! Get in touch with our team</p>
        </div>
      </section>

      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-section">
              <div className="section-tag">Send a Message</div>
              <h2>Get In Touch</h2>
              <p>Fill out the form below and we'll respond within 24 hours. We're here to help!</p>
              
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">
                    Full Name *
                    <i className="fas fa-user form-icon"></i>
                  </label>
                  <input 
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required 
                    placeholder="John Doe"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">
                      Email Address *
                      <i className="fas fa-envelope form-icon"></i>
                    </label>
                    <input 
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required 
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">
                      Phone Number
                      <i className="fas fa-phone form-icon"></i>
                    </label>
                    <input 
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+84 123 456 789"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">
                    Subject *
                    <i className="fas fa-tag form-icon"></i>
                  </label>
                  <select 
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Question</option>
                    <option value="technical">Technical Support</option>
                    <option value="recipe">About Recipes</option>
                    <option value="payment">Payment Issue</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">
                    Message *
                    <i className="fas fa-comment form-icon"></i>
                  </label>
                  <textarea 
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required 
                    placeholder="Tell us more about your question or issue..."
                  ></textarea>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox"
                      id="newsletter"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleChange}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-text">
                      Subscribe to our newsletter for cooking tips and new recipes
                    </span>
                  </label>
                </div>

                {formStatus === 'success' && (
                  <div className="form-success">
                    <i className="fas fa-check-circle"></i>
                    <span>Message sent successfully! We'll get back to you soon.</span>
                  </div>
                )}

                {formStatus === 'error' && (
                  <div className="form-error">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>Something went wrong. Please try again.</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn btn-primary btn-large"
                  disabled={formStatus === 'sending'}
                >
                  {formStatus === 'sending' ? (
                    <>
                      <div className="loading-spinner" style={{width: '20px', height: '20px', borderWidth: '2px'}}></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="contact-info-section">
              <div className="section-tag">Contact Information</div>
              <h2>Let's Connect</h2>
              <p>We're available on multiple channels to support you in the best way possible.</p>

              <div className="contact-methods">
                <div className="contact-method">
                  <div className="method-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="method-content">
                    <h3>Visit Us</h3>
                    <p>University of Economics Ho Chi Minh City<br />Ho Chi Minh City, Vietnam</p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="method-content">
                    <h3>Call Us</h3>
                    <p>+84 123 456 789<br />Mon-Fri: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="method-content">
                    <h3>Email Us</h3>
                    <p>nguyenthanhbinh@cookingrecipe.com<br />We reply within 24 hours</p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <i className="fas fa-comments"></i>
                  </div>
                  <div className="method-content">
                    <h3>Live Chat</h3>
                    <p>Chat with our support team<br />Available 24/7</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="contact-social">
                <h3>Follow Us</h3>
                <p>Stay connected on social media for daily recipes and cooking tips</p>
                <div className="social-links-grid">
                  <a href="#" className="social-card facebook">
                    <i className="fab fa-facebook-f"></i>
                    <span>Facebook</span>
                  </a>
                  <a href="#" className="social-card instagram">
                    <i className="fab fa-instagram"></i>
                    <span>Instagram</span>
                  </a>
                  <a href="#" className="social-card youtube">
                    <i className="fab fa-youtube"></i>
                    <span>YouTube</span>
                  </a>
                  <a href="#" className="social-card twitter">
                    <i className="fab fa-twitter"></i>
                    <span>Twitter</span>
                  </a>
                </div>
              </div>

              {/* FAQ Quick Links */}
              <div className="contact-faq">
                <h3>Quick Help</h3>
                <ul className="faq-links">
                  <li>
                    <a href="#">
                      <i className="fas fa-question-circle"></i>
                      Frequently Asked Questions
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fas fa-book"></i>
                      User Guide
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fas fa-video"></i>
                      Video Tutorials
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fas fa-life-ring"></i>
                      Support Center
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Contact
