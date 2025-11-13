import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCart, removeFromCart, type CartItem } from '../services/cart'
import { getUserSession } from '../services/auth'

function Cart() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      setLoading(true)
      setError(null)
      const session = getUserSession()
      if (!session) {
        navigate('/login')
        return
      }

      const cartData = await getCart()
      setCartItems(cartData.items)
    } catch (err) {
      console.error('Failed to load cart:', err)
      setError(err instanceof Error ? err.message : 'Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (recipeId: number) => {
    try {
      await removeFromCart(recipeId)
      setCartItems(prev => prev.filter(item => item.recipeId !== recipeId))
    } catch (err) {
      console.error('Failed to remove item:', err)
      alert('Failed to remove item from cart')
    }
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty')
      return
    }
    navigate('/checkout')
  }

  const total = cartItems.reduce((sum, item) => sum + item.price, 0)

  if (loading) {
    return (
      <main>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your cart...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main>
        <div className="checkout-container">
          <div className="empty-cart">
            <i className="fas fa-exclamation-triangle"></i>
            <h2>Error loading cart</h2>
            <p>{error}</p>
            <button 
              className="btn btn-primary"
              onClick={loadCart}
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (cartItems.length === 0) {
    return (
      <main>
        <section className="page-header">
          <div className="container">
            <h1 className="page-title">Shopping Cart</h1>
            <p className="page-subtitle">Review your selected video recipes</p>
          </div>
        </section>

        <div className="checkout-container">
          <div className="empty-cart">
            <i className="fas fa-shopping-cart"></i>
            <h2>Your cart is empty</h2>
            <p>Add some video recipes to get started!</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/recipes')}
            >
              Browse Recipes
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Shopping Cart</h1>
          <p className="page-subtitle">Review your selected video recipes</p>
        </div>
      </section>

      <div className="checkout-container">

        <div className="checkout-content">
          <div className="checkout-form-section" style={{ flex: '1 1 100%' }}>
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    {item.videoThumbnail ? (
                      <img src={item.videoThumbnail} alt={item.title} />
                    ) : (
                      <div className="placeholder-image">
                        <i className="fas fa-image"></i>
                      </div>
                    )}
                  </div>
                  <div className="item-details">
                    <h4>{item.title}</h4>
                    <div className="item-meta">
                      <span className="item-category">{item.category}</span>
                      <span className="item-difficulty">{item.difficulty}</span>
                      <span className="item-time">
                        <i className="fas fa-clock"></i> {item.cookingTime} min
                      </span>
                    </div>
                  </div>
                  <div className="item-price">
                    <span>${item.price.toFixed(2)}</span>
                    <button 
                      onClick={() => handleRemove(item.recipeId)}
                      className="remove-btn"
                      title="Remove item"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="checkout-summary">
            <h3>Order Summary</h3>
            <div className="order-items-list">
              {cartItems.map(item => (
                <div key={item.id} className="order-item-line">
                  <span className="item-name">{item.title}</span>
                  <span className="item-price">${item.price.toFixed(2)}</span>
                </div>
              ))}
              <div className="order-totals">
                <div className="total-line total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary btn-large checkout-btn"
              onClick={handleCheckout}
            >
              <i className="fas fa-arrow-right"></i>
              Proceed to Checkout
            </button>

            <button
              className="btn btn-outline btn-large"
              onClick={() => navigate('/recipes')}
              style={{ marginTop: 'var(--spacing-md)' }}
            >
              <i className="fas fa-arrow-left"></i>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Cart

