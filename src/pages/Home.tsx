// React import not required with react-jsx runtime
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { getUserSession } from '../services/auth'
import YouTubePlayer from '../components/YouTubePlayer'

function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    const session = getUserSession()
    if ((session?.user.role || '').toLowerCase() === 'admin') {
      navigate('/admin/courses')
    }
  }, [navigate])

  return (
    <main>
      <section className="hero">
        <div className="hero-background"><div className="hero-pattern"></div></div>
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Learn from <span className="gradient-text">Master</span></h1>
            <p className="hero-subtitle">Learn from professional chefs !</p>
            <div className="hero-buttons">
              <Link to="/courses" className="btn btn-primary">
                <i className="fas fa-play"></i>
                Browse Courses
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item"><div className="stat-number">50+</div><div className="stat-label">Video Recipes</div></div>
              <div className="stat-item"><div className="stat-number">4.8</div><div className="stat-label">Rating</div></div>
            </div>
          </div>
          <div className="hero-video">
            <div className="hero-video-container">
              <YouTubePlayer
                videoId="V37douhyx_0"
                width="932px"
                height="524px"
                autoplay={true}
              />
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}

export default Home

