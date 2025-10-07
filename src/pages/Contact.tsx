// React import not required with react-jsx runtime

function Contact() {
  return (
    <main>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Contact Us</h1>
          <p className="page-subtitle">We are always ready to listen and support you</p>
        </div>
      </section>

      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-form-section">
              <h2>Send us a message</h2>
              <p>Fill out the form below and we will respond within 24 hours.</p>
              <form className="contact-form" onSubmit={(e)=>e.preventDefault()}>
                <div className="form-group"><label htmlFor="name">Full Name *</label><input id="name" required /></div>
                <div className="form-group"><label htmlFor="email">Email *</label><input id="email" type="email" required /></div>
                <div className="form-group"><label htmlFor="phone">Phone Number</label><input id="phone" /></div>
                <div className="form-group"><label htmlFor="subject">Subject *</label><select id="subject" required><option value="">Select subject</option><option value="general">General Question</option><option value="technical">Technical Support</option><option value="recipe">About Recipes</option><option value="payment">Payment</option><option value="partnership">Partnership</option><option value="other">Other</option></select></div>
                <div className="form-group"><label htmlFor="message">Message *</label><textarea id="message" rows={6} required placeholder="Please share details about your question or issue..."></textarea></div>
                <div className="form-group checkbox-group"><label className="checkbox-label"><input type="checkbox" id="newsletter" />I want to receive information about new recipes and updates</label></div>
                <button type="submit" className="btn btn-primary btn-large"><i className="fas fa-paper-plane"></i> Send Message</button>
              </form>
            </div>
            <div className="contact-info-section">
              <h2>Contact Information</h2>
              <p>We are available on multiple channels to support you best.</p>
              <div className="contact-methods">
                <div className="contact-method"><div className="method-icon"><i className="fas fa-map-marker-alt"></i></div><div className="method-content"><h3>Address</h3><p>Ho Chi Minh City, Vietnam</p></div></div>
                <div className="contact-method"><div className="method-icon"><i className="fas fa-phone"></i></div><div className="method-content"><h3>Phone</h3><p>+84 123 456 789</p></div></div>
                <div className="contact-method"><div className="method-icon"><i className="fas fa-envelope"></i></div><div className="method-content"><h3>Email</h3><p>nguyenthanhbinh@cookingrecipe.com</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Contact

