import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCart, type CartItem } from '../services/cart'
import { getUserSession } from '../services/auth'
import { createTransaction, submitPayment } from '../services/transactions'

interface CheckoutForm {
  paymentMethod: 'online_banking' | 'paypal'
  paymentProof: File | null
}

function Checkout() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [formData, setFormData] = useState<CheckoutForm>({
    paymentMethod: 'online_banking',
    paymentProof: null
  })
  const [loading, setLoading] = useState(false)
  const [creatingTransaction, setCreatingTransaction] = useState(false)
  const [errors, setErrors] = useState<{ paymentMethod?: string; paymentProof?: string }>({})
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [transactionId, setTransactionId] = useState<number | null>(null)

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      const session = getUserSession()
      if (!session) {
        navigate('/login')
        return
      }

      const cartData = await getCart()
      setCartItems(cartData.items)
    } catch (err) {
      console.error('Failed to load cart:', err)
      if (err instanceof Error && err.message.includes('Authentication required')) {
        navigate('/login')
      } else {
        alert('Failed to load cart. Please try again.')
        navigate('/cart')
      }
    }
  }

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, paymentMethod: e.target.value as 'online_banking' | 'paypal' }))
    if (errors.paymentMethod) {
      setErrors(prev => ({ ...prev, paymentMethod: undefined }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, paymentProof: 'Please upload an image file' }))
        return
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, paymentProof: 'File size must be less than 5MB' }))
        return
      }

      setFormData(prev => ({ ...prev, paymentProof: file }))
      setErrors(prev => ({ ...prev, paymentProof: undefined }))

      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: { paymentMethod?: string; paymentProof?: string } = {}

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method'
    }

    if (!formData.paymentProof) {
      newErrors.paymentProof = 'Please upload payment proof image'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)

      // Step 1: Create transaction if not already created
      let currentTransactionId = transactionId
      if (!currentTransactionId) {
        setCreatingTransaction(true)
        const transactionResponse = await createTransaction()
        currentTransactionId = transactionResponse.data.id
        setTransactionId(currentTransactionId)
        setCreatingTransaction(false)
      }

      // Step 2: Submit payment proof
      if (!formData.paymentProof) {
        throw new Error('Payment proof is required')
      }

      const paymentMethodLabel = formData.paymentMethod === 'online_banking' ? 'Online Banking' : 'PayPal'
      await submitPayment(currentTransactionId, paymentMethodLabel, formData.paymentProof)

      // Redirect to My Orders page
      navigate('/my-orders')
    } catch (error) {
      console.error('Checkout failed:', error)
      alert(error instanceof Error ? error.message : 'Checkout failed. Please try again.')
    } finally {
      setLoading(false)
      setCreatingTransaction(false)
    }
  }

  const total = cartItems.reduce((sum, item) => sum + item.price, 0)

  if (cartItems.length === 0) {
    return (
      <main>
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
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <nav className="checkout-steps">
            <div className="step active">
              <span className="step-number">1</span>
              <span className="step-label">Cart</span>
            </div>
            <div className="step active">
              <span className="step-number">2</span>
              <span className="step-label">Payment</span>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <span className="step-label">Complete</span>
            </div>
          </nav>
        </div>

        <div className="checkout-content">
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-section">
                <h3>Payment Method</h3>
                <div className="payment-methods">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online_banking"
                      checked={formData.paymentMethod === 'online_banking'}
                      onChange={handlePaymentMethodChange}
                    />
                    <div className="payment-card">
                      <i className="fas fa-university"></i>
                      <span>Online Banking</span>
                    </div>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handlePaymentMethodChange}
                    />
                    <div className="payment-card">
                      <i className="fab fa-paypal"></i>
                      <span>PayPal</span>
                    </div>
                  </label>
                </div>
                {errors.paymentMethod && <span className="error-message">{errors.paymentMethod}</span>}
              </div>

              <div className="form-section">
                <h3>Payment Proof</h3>
                <p className="form-help-text">
                  Please upload a screenshot or image of your payment confirmation.
                </p>
                <div className="form-group">
                  <label htmlFor="paymentProof" className="file-upload-label">
                    <input
                      type="file"
                      id="paymentProof"
                      name="paymentProof"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="file-input"
                    />
                    <div className="file-upload-button">
                      <i className="fas fa-cloud-upload-alt"></i>
                      <span>{formData.paymentProof ? formData.paymentProof.name : 'Choose File'}</span>
                    </div>
                  </label>
                  {errors.paymentProof && <span className="error-message">{errors.paymentProof}</span>}
                  {previewUrl && (
                    <div className="payment-proof-preview">
                      <img src={previewUrl} alt="Payment proof preview" />
                      <button
                        type="button"
                        className="remove-preview-btn"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, paymentProof: null }))
                          setPreviewUrl(null)
                          if (previewUrl) {
                            URL.revokeObjectURL(previewUrl)
                          }
                        }}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-section">
                <div className="payment-info-box">
                  <h4>
                    <i className="fas fa-info-circle"></i>
                    Payment Instructions
                  </h4>
                  <ul>
                    <li>After submitting, your order will be pending verification</li>
                    <li>An admin will review your payment proof</li>
                    <li>You will be notified once your payment is verified</li>
                    <li>Access to purchased recipes will be granted after verification</li>
                  </ul>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-large checkout-btn"
                disabled={loading || creatingTransaction}
              >
                {loading || creatingTransaction ? (
                  <>
                    <div className="loading-spinner"></div>
                    {creatingTransaction ? 'Creating Order...' : 'Submitting Payment...'}
                  </>
                ) : (
                  <>
                    <i className="fas fa-lock"></i>
                    Submit Payment - ${total.toFixed(2)}
                  </>
                )}
              </button>
            </form>
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

            <div className="security-badges">
              <div className="security-item">
                <i className="fas fa-shield-alt"></i>
                <span>Secure Payment</span>
              </div>
              <div className="security-item">
                <i className="fas fa-lock"></i>
                <span>SSL Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Checkout