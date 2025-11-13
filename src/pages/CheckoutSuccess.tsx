import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

function CheckoutSuccess() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showNotification, setShowNotification] = useState(true)

  useEffect(() => {
    // Show notification for 3 seconds, then redirect
    const timer = setTimeout(() => {
      setShowNotification(false)
      navigate('/recipes')
    }, 3000)

    return () => clearTimeout(timer)
  }, [navigate])

  if (!showNotification) {
    return null
  }

  return (
    <div className="checkout-success-notification">
      <div className="notification-content">
        <div className="notification-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <div className="notification-text">
          <h3>Payment Submitted Successfully!</h3>
          <p>Your payment proof has been submitted. An admin will review and verify your payment. You will be notified once your payment is verified.</p>
        </div>
        <button 
          className="notification-close"
          onClick={() => {
            setShowNotification(false)
            navigate('/recipes')
          }}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  )
}

export default CheckoutSuccess
