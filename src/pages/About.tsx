// React import not required with react-jsx runtime

function About() {
  return (
    <main>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">About Us</h1>
          <p className="page-subtitle">Discover the story behind Cooking Recipe - Your culinary companion</p>
        </div>
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
                  <div className="image-overlay">
                    <div className="overlay-stat">
                      <i className="fas fa-users"></i>
                      <span>50K+ Members</span>
                    </div>
                  </div>
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
                    <span className="stat-number">10,000+</span>
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
                    <span className="stat-number">100+</span>
                    <span className="stat-label">Expert Chefs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="about-section values-section">
            <div className="section-header">
              <div className="section-tag center">What We Stand For</div>
              <h2>Our Core Values</h2>
              <p>The principles that guide everything we do</p>
            </div>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-star"></i>
                </div>
                <h3>Quality First</h3>
                <p>Every recipe is carefully curated and tested to ensure the best results for our community.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-heart"></i>
                </div>
                <h3>Passion for Food</h3>
                <p>We celebrate the joy of cooking and the connections it creates between people and cultures.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-lightbulb"></i>
                </div>
                <h3>Innovation</h3>
                <p>Constantly evolving our platform to provide the best learning experience for our users.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-users"></i>
                </div>
                <h3>Community</h3>
                <p>Building a supportive environment where cooks of all levels can learn and grow together.</p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="about-section team-section">
            <div className="section-header">
              <div className="section-tag center">Meet Our Chefs</div>
              <h2>Expert Culinary Team</h2>
              <p>Professional chefs dedicated to sharing their knowledge</p>
            </div>
            <div className="team-grid">
              <div className="team-card">
                <div className="team-avatar">
                  <img src="/images/Avatar_Chef.png" alt="Chef" />
                </div>
                <h4>Chef Maria Rodriguez</h4>
                <p className="team-role">Master Chef - Italian Cuisine</p>
                <p className="team-bio">15+ years of culinary excellence</p>
                <div className="team-social">
                  <a href="#"><i className="fab fa-instagram"></i></a>
                  <a href="#"><i className="fab fa-youtube"></i></a>
                  <a href="#"><i className="fab fa-twitter"></i></a>
                </div>
              </div>
              <div className="team-card">
                <div className="team-avatar">
                  <img src="/images/Avatar_Chef.png" alt="Chef" />
                </div>
                <h4>Chef Nguyen Thanh</h4>
                <p className="team-role">Master Chef - Vietnamese Cuisine</p>
                <p className="team-bio">20+ years preserving tradition</p>
                <div className="team-social">
                  <a href="#"><i className="fab fa-instagram"></i></a>
                  <a href="#"><i className="fab fa-youtube"></i></a>
                  <a href="#"><i className="fab fa-twitter"></i></a>
                </div>
              </div>
              <div className="team-card">
                <div className="team-avatar">
                  <img src="/images/Avatar_Chef.png" alt="Chef" />
                </div>
                <h4>Chef Tanaka Yuki</h4>
                <p className="team-role">Master Chef - Japanese Cuisine</p>
                <p className="team-bio">12+ years of Michelin experience</p>
                <div className="team-social">
                  <a href="#"><i className="fab fa-instagram"></i></a>
                  <a href="#"><i className="fab fa-youtube"></i></a>
                  <a href="#"><i className="fab fa-twitter"></i></a>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="about-cta">
            <div className="cta-content">
              <h2>Ready to Start Your Culinary Journey?</h2>
              <p>Join thousands of home cooks learning from professional chefs</p>
              <div className="cta-buttons">
                <a href="/recipes" className="btn btn-primary btn-large">
                  <i className="fas fa-play"></i>
                  Browse Video Recipes
                </a>
                <a href="/contact" className="btn btn-outline btn-large">
                  <i className="fas fa-envelope"></i>
                  Get In Touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default About
