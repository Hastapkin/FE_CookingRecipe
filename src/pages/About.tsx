// React import not required with react-jsx runtime

function About() {
  return (
    <main>
      <section className="page-header">
      </section>

      <section className="about-content">
        <div className="container">
          {/* Mission Section */}
          <div className="about-section">
            <div className="section-content">
              <div className="text-content">
                <div className="section-tag">Our Purpose</div>
                <h2>Empowering Home Cooks Worldwide</h2>
                <p>
                  Cooking Recipe was founded with the mission to connect cooking enthusiasts across Vietnam and the world. 
                  We believe that everyone deserves access to high-quality cooking education through engaging video content.
                </p>
                <p>
                  Our platform brings together professional chefs, home cooking experts, and food lovers to create a 
                  vibrant community where culinary skills flourish. Through step-by-step video tutorials, we make 
                  complex recipes accessible to everyone.
                </p>
                <div className="feature-list">
                  <div className="feature-item">
                    <i className="fas fa-check-circle"></i>
                    <span>Professional chef-led video tutorials</span>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-check-circle"></i>
                    <span>Authentic recipes from around the world</span>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-check-circle"></i>
                    <span>Detailed ingredient lists and instructions</span>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-check-circle"></i>
                    <span>Community-driven ratings and reviews</span>
                  </div>
                </div>
              </div>
              <div className="image-content">
                <div className="image-wrapper">
                  <img src="/images/Avatar_Chef.png" alt="Professional Chef" />
                </div>
              </div>
            </div>
          </div>

          {/* Story Section */}
          <div className="about-section story-section">
            <div className="section-content reverse">
              <div className="image-content">
                <div className="image-wrapper">
                  <img src="/images/hero.jpg" alt="Cooking Journey" />
                  <div className="image-badge">
                    <i className="fas fa-heart"></i>
                    <span>Made with Love</span>
                  </div>
                </div>
              </div>
              <div className="text-content">
                <div className="section-tag">Our Journey</div>
                <h2>From Passion to Platform</h2>
                <p>
                  Started from a simple idea: creating a place where people can share their favorite cooking recipes 
                  and learn from each other. What began as a small collection of family recipes has grown into a 
                  comprehensive platform serving thousands of cooking enthusiasts.
                </p>
                <p>
                  Today, Cooking Recipe stands as a testament to the power of sharing culinary knowledge. We've helped 
                  home cooks master techniques, discover new cuisines, and bring joy to their kitchens and dining tables.
                </p>
                <div className="stats">
                  <div className="stat-item">
                    <div className="stat-icon">
                      <i className="fas fa-video"></i>
                    </div>
                    <span className="stat-number">300+</span>
                    <span className="stat-label">Video Recipes</span>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon">
                      <i className="fas fa-users"></i>
                    </div>
                    <span className="stat-number">50,000+</span>
                    <span className="stat-label">Happy Members</span>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon">
                      <i className="fas fa-award"></i>
                    </div>
                    <span className="stat-number">10+</span>
                    <span className="stat-label">Expert Chefs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default About
