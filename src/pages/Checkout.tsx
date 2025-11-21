import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getCart, type CartItem } from '../services/cart'
import { getUserSession } from '../services/auth'
import { createTransaction, submitPayment, getTransactions } from '../services/transactions'

interface CheckoutForm {
  paymentMethod: 'vietqr' | 'paypal'
  paymentProof: File | null
}

// VietQR Configuration
const VIETQR_CONFIG = {
  bankCode: 'sacombank',
  accountNumber: '050121382447',
  accountName: 'Ngo Thanh Trung',
  // Static conversion rate: 1 USD = 25000 VND (can be made dynamic later)
  usdToVndRate: 25000
}

function Checkout() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [formData, setFormData] = useState<CheckoutForm>({
    paymentMethod: 'vietqr',
    paymentProof: null
  })
  const [loading, setLoading] = useState(false)
  const [creatingTransaction, setCreatingTransaction] = useState(false)
  const [loadingExistingTransaction, setLoadingExistingTransaction] = useState(false)
  const [errors, setErrors] = useState<{ paymentMethod?: string; paymentProof?: string }>({})
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [transactionId, setTransactionId] = useState<number | null>(null)
  const [vietqrUrl, setVietqrUrl] = useState<string | null>(null)

  useEffect(() => {
    const existingTransactionId = searchParams.get('transactionId')
    if (existingTransactionId) {
      // Load existing transaction
      loadExistingTransaction(parseInt(existingTransactionId))
    } else {
      // Normal checkout flow
      loadCart()
    }
  }, [searchParams])

  const loadExistingTransaction = async (id: number) => {
    try {
      setLoadingExistingTransaction(true)
      // Get transaction from the list (getUserTransactions includes recipes)
      const transactions = await getTransactions()
      const transaction = transactions.find(t => t.id === id)
      
      if (!transaction) {
        throw new Error('Transaction not found')
      }
      
      setTransactionId(transaction.id)
      
      // Load cart items from transaction recipes
      if (transaction.recipes && transaction.recipes.length > 0) {
        const items: CartItem[] = transaction.recipes.map(recipe => ({
          id: recipe.recipeId,
          recipeId: recipe.recipeId,
          title: recipe.title,
          price: recipe.price,
          videoThumbnail: recipe.videoThumbnail || undefined
        }))
        setCartItems(items)
      }

      // If transaction has payment method, set it
      if (transaction.paymentMethod) {
        const method = transaction.paymentMethod.toLowerCase().includes('vietqr') ? 'vietqr' : 'paypal'
        setFormData(prev => ({ ...prev, paymentMethod: method }))
        
        // Generate QR code if VietQR
        if (method === 'vietqr') {
          const total = transaction.totalAmount
          const amountVnd = Math.round(total * VIETQR_CONFIG.usdToVndRate)
          const addInfo = encodeURIComponent(`payment for order ${transaction.id}`)
          const accountName = encodeURIComponent(VIETQR_CONFIG.accountName)
          const qrUrl = `https://img.vietqr.io/image/${VIETQR_CONFIG.bankCode}-${VIETQR_CONFIG.accountNumber}-compact2.jpg?amount=${amountVnd}&addInfo=${addInfo}&accountName=${accountName}`
          setVietqrUrl(qrUrl)
        }
      } else {
        // No payment method yet, generate QR if VietQR is default
        if (formData.paymentMethod === 'vietqr') {
          const total = transaction.totalAmount
          const amountVnd = Math.round(total * VIETQR_CONFIG.usdToVndRate)
          const addInfo = encodeURIComponent(`payment for order ${transaction.id}`)
          const accountName = encodeURIComponent(VIETQR_CONFIG.accountName)
          const qrUrl = `https://img.vietqr.io/image/${VIETQR_CONFIG.bankCode}-${VIETQR_CONFIG.accountNumber}-compact2.jpg?amount=${amountVnd}&addInfo=${addInfo}&accountName=${accountName}`
          setVietqrUrl(qrUrl)
        }
      }
    } catch (error) {
      console.error('Failed to load existing transaction:', error)
      alert('Failed to load transaction. Redirecting to cart.')
      navigate('/cart')
    } finally {
      setLoadingExistingTransaction(false)
    }
  }

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

  // Auto-generate QR code when cart loads and VietQR is selected
  useEffect(() => {
    if (cartItems.length > 0 && formData.paymentMethod === 'vietqr' && !vietqrUrl && !transactionId) {
      const generateVietQR = async () => {
        try {
          setCreatingTransaction(true)
          // Create transaction
          const transactionResponse = await createTransaction()
          const currentTransactionId = transactionResponse.data.id
          setTransactionId(currentTransactionId)

          // Generate VietQR URL
          const total = cartItems.reduce((sum, item) => sum + item.price, 0)
          const amountVnd = Math.round(total * VIETQR_CONFIG.usdToVndRate)
          const addInfo = encodeURIComponent(`payment for order ${currentTransactionId}`)
          const accountName = encodeURIComponent(VIETQR_CONFIG.accountName)
          const qrUrl = `https://img.vietqr.io/image/${VIETQR_CONFIG.bankCode}-${VIETQR_CONFIG.accountNumber}-compact2.jpg?amount=${amountVnd}&addInfo=${addInfo}&accountName=${accountName}`
          setVietqrUrl(qrUrl)
        } catch (error) {
          console.error('Failed to create transaction for VietQR:', error)
        } finally {
          setCreatingTransaction(false)
        }
      }
      generateVietQR()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems.length, formData.paymentMethod])

  const handlePaymentMethodChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMethod = e.target.value as 'vietqr' | 'paypal'
    setFormData(prev => ({ ...prev, paymentMethod: newMethod }))
    if (errors.paymentMethod) {
      setErrors(prev => ({ ...prev, paymentMethod: undefined }))
    }

    // If VietQR is selected, create transaction and generate QR code
    if (newMethod === 'vietqr') {
      try {
        setCreatingTransaction(true)
        // Create transaction if not already created
        let currentTransactionId = transactionId
        if (!currentTransactionId) {
          const transactionResponse = await createTransaction()
          currentTransactionId = transactionResponse.data.id
          setTransactionId(currentTransactionId)
        }

        // Generate VietQR URL
        const amountVnd = Math.round(total * VIETQR_CONFIG.usdToVndRate)
        const addInfo = encodeURIComponent(`payment for order ${currentTransactionId}`)
        const accountName = encodeURIComponent(VIETQR_CONFIG.accountName)
        const qrUrl = `https://img.vietqr.io/image/${VIETQR_CONFIG.bankCode}-${VIETQR_CONFIG.accountNumber}-compact2.jpg?amount=${amountVnd}&addInfo=${addInfo}&accountName=${accountName}`
        setVietqrUrl(qrUrl)
      } catch (error) {
        console.error('Failed to create transaction for VietQR:', error)
        alert('Failed to generate QR code. Please try again.')
      } finally {
        setCreatingTransaction(false)
      }
    } else {
      // Clear QR code for other payment methods
      setVietqrUrl(null)
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

      const paymentMethodLabel = formData.paymentMethod === 'paypal' ? 'PayPal' : 'VietQR'
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

  // Show loading state when loading existing transaction
  if (loadingExistingTransaction) {
    return (
      <main>
        <div className="checkout-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading transaction...</p>
          </div>
        </div>
      </main>
    )
  }

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
                      value="vietqr"
                      checked={formData.paymentMethod === 'vietqr'}
                      onChange={handlePaymentMethodChange}
                    />
                    <div className="payment-card">
                      <i className="fas fa-qrcode"></i>
                      <span>VietQR</span>
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

              {/* VietQR QR Code Display */}
              {formData.paymentMethod === 'vietqr' && vietqrUrl && (
                <div className="form-section">
                  <h3>Scan QR Code to Pay</h3>
                  <p className="form-help-text">
                    Scan this QR code with your banking app to complete the payment.
                    Amount: {Math.round(total * VIETQR_CONFIG.usdToVndRate).toLocaleString('vi-VN')} VND
                    {transactionId && ` (Order #${transactionId})`}
                  </p>
                  <div className="vietqr-container">
                    <img src={vietqrUrl} alt="VietQR Payment Code" className="vietqr-image" />
                  </div>
                </div>
              )}

              <div className="form-section">
                <h3>Payment Proof</h3>
                <p className="form-help-text">
                  {formData.paymentMethod === 'vietqr' 
                    ? 'After scanning the QR code and completing payment, please upload a screenshot of your payment confirmation.'
                    : 'Please upload a screenshot or image of your payment confirmation.'
                  }
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