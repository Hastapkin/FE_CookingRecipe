// React import not required with react-jsx runtime

function About() {
  return (
    <main>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">About Us</h1>
          <p className="page-subtitle">Discover the story behind Cooking Recipe</p>
        </div>
      </section>

      <section className="about-content">
        <div className="container">
          <div className="about-section">
            <div className="section-content">
              <div className="text-content">
                <h2>Our Mission</h2>
                <p>Cooking Recipe was founded with the mission to connect cooking enthusiasts across Vietnam and the world.</p>
                <p>We create a community where everyone can learn, share and develop their cooking skills.</p>
              </div>
              <div className="image-content"><img src="/images/about-mission.jpg" alt="Our Mission" /></div>
            </div>
          </div>

          <div className="about-section story-section">
            <div className="section-content">
              <div className="image-content"><img src="/images/about-story.jpg" alt="Our Story" /></div>
              <div className="text-content">
                <h2>Our Story</h2>
                <p>Started from a simple idea: creating a place where people can share their favorite cooking recipes.</p>
                <div className="stats">
                  <div className="stat-item"><span className="stat-number">10,000+</span><span className="stat-label">Recipes</span></div>
                  <div className="stat-item"><span className="stat-number">50,000+</span><span className="stat-label">Members</span></div>
                  <div className="stat-item"><span className="stat-number">100+</span><span className="stat-label">Chefs</span></div>
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

