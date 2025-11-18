// React import not required with react-jsx runtime
import { useState } from 'react'
import emailjs from '@emailjs/browser'

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
  const [errorMessage, setErrorMessage] = useState('')

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
    setErrorMessage('')

    // Get EmailJS configuration from environment variables
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    // Check if EmailJS is configured
    if (!serviceId || !templateId || !publicKey) {
      setFormStatus('error')
      setErrorMessage('Email service is not configured. Please contact the administrator.')
      return
    }

    try {
      // Template 1: Send to admin (phamtuan301104@gmail.com) with form information
      const adminTemplateParams = {
        to_email: import.meta.env.VITE_CONTACT_EMAIL || 'phamtuan301104@gmail.com',
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone || 'Not provided',
        subject: formData.subject,
        message: formData.message,
        newsletter: formData.newsletter ? 'Yes' : 'No',
        reply_to: formData.email,
      }

      // Template 2: Send confirmation to user
      const confirmationTemplateId = import.meta.env.VITE_EMAILJS_CONFIRMATION_TEMPLATE_ID || templateId // Use same template if confirmation template not set
      const confirmationTemplateParams = {
        email: formData.email, // Send to the person who filled the form (matches {{email}} in template)
        to_email: formData.email, // Also send for compatibility
        user_name: formData.name,
        subject: formData.subject,
      }

      // Send email to admin
      const adminResponse = await emailjs.send(
        serviceId,
        templateId,
        adminTemplateParams,
        publicKey
      )

      console.log('Admin email sent successfully:', adminResponse)

      // Send confirmation email to user (if confirmation template is configured)
      if (import.meta.env.VITE_EMAILJS_CONFIRMATION_TEMPLATE_ID) {
        try {
          const confirmationResponse = await emailjs.send(
            serviceId,
            confirmationTemplateId,
            confirmationTemplateParams,
            publicKey
          )
          console.log('Confirmation email sent successfully:', confirmationResponse)
        } catch (confirmationError) {
          // Don't fail if confirmation email fails, just log it
          console.warn('Failed to send confirmation email:', confirmationError)
        }
      }
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
        setErrorMessage('')
      }, 3000)
    } catch (error: any) {
      console.error('Email sending error:', error)
      
      // Extract detailed error message from EmailJS response
      let errorMsg = 'Failed to send message. Please try again later.'
      
      // Check for specific error messages first
      if (error?.text) {
        const errorText = error.text.toLowerCase()
        
        // Recipient email is empty
        if (errorText.includes('recipients address is empty') || errorText.includes('recipient')) {
          errorMsg = 'Recipient email is not configured. Please go to EmailJS Dashboard > Email Services, edit your service, and add your email address in the "To Email" or "Recipient Email" field.'
        }
        // Template parameter errors
        else if (errorText.includes('template') || errorText.includes('parameter')) {
          errorMsg = `Template Error: ${error.text}. Please check your EmailJS template - ensure all variables ({{from_name}}, {{from_email}}, {{phone}}, {{subject}}, {{message}}, {{newsletter}}) are present.`
        }
        // Other errors
        else {
          errorMsg = `EmailJS Error: ${error.text}`
        }
      } else if (error?.message) {
        errorMsg = error.message
      } else if (typeof error === 'string') {
        errorMsg = error
      }
      
      // Common error messages by status code
      if (error?.status === 422) {
        if (!error?.text) {
          errorMsg = 'Invalid template parameters. Please check your EmailJS template configuration - ensure all variables match the code.'
        }
      } else if (error?.status === 400) {
        if (!error?.text) {
          errorMsg = 'Invalid request. Please check your EmailJS service and template IDs.'
        }
      } else if (error?.status === 401) {
        if (!error?.text) {
          errorMsg = 'Unauthorized. Please check your EmailJS public key.'
        }
      }
      
      setFormStatus('error')
      setErrorMessage(errorMsg)
    }
  }

  return (
    <main>
      <section className="page-header">
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
                    placeholder="Nguyen Thanh Binh"
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
                      placeholder="ntbinh@gmail.com"
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
                    <span>{errorMessage || 'Something went wrong. Please try again.'}</span>
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
          </div>
        </div>
      </section>
    </main>
  )
}

export default Contact
