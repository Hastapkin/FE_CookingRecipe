import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

interface OrderData {
  orderId: string;
  total: number;
  items: Array<{
    id: number;
    title: string;
    price: number;
    youtubeVideoId: string;
    videoThumbnail?: string;
    quantity: number;
  }>;
}

function CheckoutSuccess() {
  const location = useLocation();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (location.state) {
      setOrderData(location.state as OrderData);
    } else {
      // If no order data, redirect to home
      window.location.href = '/';
    }
  }, [location.state]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Auto redirect to recipes page
      window.location.href = '/recipes';
    }
  }, [countdown]);

  if (!orderData) {
    return (
      <main>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading order details...</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="success-container">
        <div className="success-content">
          <div className="success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          
          <h1>Payment Successful!</h1>
          <p className="success-message">
            Thank you for your purchase. Your order has been confirmed and you now have access to all purchased video recipes.
          </p>

          <div className="order-details">
            <h3>Order Details</h3>
            <div className="order-info">
              <div className="info-item">
                <span className="label">Order ID:</span>
                <span className="value">{orderData.orderId}</span>
              </div>
              <div className="info-item">
                <span className="label">Total Amount:</span>
                <span className="value">${orderData.total.toFixed(2)}</span>
              </div>
              <div className="info-item">
                <span className="label">Payment Status:</span>
                <span className="value status-paid">Paid</span>
              </div>
              <div className="info-item">
                <span className="label">Purchase Date:</span>
                <span className="value">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="purchased-items">
            <h3>Your Video Recipes</h3>
            <div className="items-list">
              {orderData.items.map(item => (
                <div key={item.id} className="purchased-item">
                  <div className="item-thumbnail">
                    <img src={item.videoThumbnail} alt={item.title} />
                    <div className="play-overlay">
                      <i className="fas fa-play"></i>
                    </div>
                  </div>
                  <div className="item-info">
                    <h4>{item.title}</h4>
                    <p>Professional video tutorial with step-by-step instructions</p>
                    <div className="item-meta">
                      <span className="price">${item.price.toFixed(2)}</span>
                      <span className="quantity">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="item-actions">
                    <Link 
                      to={`/recipe-detail/${item.id}`} 
                      className="btn btn-primary btn-small"
                    >
                      <i className="fas fa-play"></i> Watch Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="next-steps">
            <h3>What's Next?</h3>
            <div className="steps-grid">
              <div className="step-item">
                <div className="step-icon">
                  <i className="fas fa-video"></i>
                </div>
                <h4>Watch Videos</h4>
                <p>Access your purchased video recipes and start cooking like a pro!</p>
              </div>
              <div className="step-item">
                <div className="step-icon">
                  <i className="fas fa-download"></i>
                </div>
                <h4>Download Recipe Cards</h4>
                <p>Get printable recipe cards for easy reference in the kitchen.</p>
              </div>
              <div className="step-item">
                <div className="step-icon">
                  <i className="fas fa-star"></i>
                </div>
                <h4>Rate & Review</h4>
                <p>Share your experience and help other cooks discover great recipes.</p>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <Link to="/recipes" className="btn btn-primary btn-large">
              <i className="fas fa-utensils"></i>
              Browse More Recipes
            </Link>
            <Link to="/my-recipes" className="btn btn-outline btn-large">
              <i className="fas fa-book"></i>
              My Recipe Library
            </Link>
          </div>

          <div className="auto-redirect">
            <p>
              <i className="fas fa-clock"></i>
              Redirecting to recipes page in {countdown} seconds...
            </p>
          </div>
        </div>

        <div className="success-sidebar">
          <div className="sidebar-card">
            <h4>Need Help?</h4>
            <p>If you have any questions about your order or need assistance, we're here to help!</p>
            <div className="contact-options">
              <a href="mailto:support@cookingrecipes.com" className="contact-link">
                <i className="fas fa-envelope"></i>
                Email Support
              </a>
              <a href="/contact" className="contact-link">
                <i className="fas fa-phone"></i>
                Contact Us
              </a>
            </div>
          </div>

          <div className="sidebar-card">
            <h4>Stay Updated</h4>
            <p>Get notified about new video recipes and exclusive offers!</p>
            <div className="newsletter-signup">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="newsletter-input"
              />
              <button className="btn btn-primary btn-small">
                Subscribe
              </button>
            </div>
          </div>

          <div className="sidebar-card">
            <h4>Share Your Success</h4>
            <p>Show off your cooking skills and inspire others!</p>
            <div className="social-share">
              <button className="social-btn facebook">
                <i className="fab fa-facebook-f"></i>
                Share
              </button>
              <button className="social-btn twitter">
                <i className="fab fa-twitter"></i>
                Tweet
              </button>
              <button className="social-btn instagram">
                <i className="fab fa-instagram"></i>
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CheckoutSuccess;
