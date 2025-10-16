import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import PriceButton from '../components/PriceButton'

interface CartItem {
  id: number;
  title: string;
  price: number;
  youtubeVideoId: string;
  videoThumbnail?: string;
  quantity: number;
}

interface CheckoutForm {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  paymentMethod: 'stripe' | 'paypal';
}

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState<CheckoutForm>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    paymentMethod: 'stripe'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});

  // Sample cart items - replace with actual cart state
  useEffect(() => {
    const sampleItems: CartItem[] = [
      {
        id: 1,
        title: "Vietnamese Com Tam",
        price: 4.99,
        youtubeVideoId: "P50LW8SzfXQ",
        videoThumbnail: "https://img.youtube.com/vi/P50LW8SzfXQ/maxresdefault.jpg",
        quantity: 1
      },
    ];
    setCartItems(sampleItems);
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof CheckoutForm]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutForm> = {};

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to success page
      navigate('/checkout/success', { 
        state: { 
          orderId: Math.random().toString(36).substr(2, 9).toUpperCase(),
          total: total,
          items: cartItems
        }
      });
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

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
    );
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
              <span className="step-label">Checkout</span>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <span className="step-label">Payment</span>
            </div>
            <div className="step">
              <span className="step-number">4</span>
              <span className="step-label">Complete</span>
            </div>
          </nav>
        </div>

        <div className="checkout-content">
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-section">
                <h3>Contact Information</h3>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="your@email.com"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
              </div>

              <div className="form-section">
                <h3>Billing Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? 'error' : ''}
                    />
                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? 'error' : ''}
                    />
                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={errors.address ? 'error' : ''}
                    placeholder="123 Main Street"
                  />
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={errors.city ? 'error' : ''}
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">State *</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={errors.state ? 'error' : ''}
                    />
                    {errors.state && <span className="error-message">{errors.state}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="zipCode">ZIP Code *</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className={errors.zipCode ? 'error' : ''}
                    />
                    {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="JP">Japan</option>
                    <option value="KR">South Korea</option>
                    <option value="VN">Vietnam</option>
                  </select>
                </div>
              </div>

              <div className="form-section">
                <h3>Payment Method</h3>
                <div className="payment-methods">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="stripe"
                      checked={formData.paymentMethod === 'stripe'}
                      onChange={handleInputChange}
                    />
                    <div className="payment-card">
                      <i className="fab fa-cc-stripe"></i>
                      <span>Credit/Debit Card</span>
                    </div>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleInputChange}
                    />
                    <div className="payment-card">
                      <i className="fab fa-paypal"></i>
                      <span>PayPal</span>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-large checkout-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <i className="fas fa-lock"></i>
                    Complete Purchase - ${total.toFixed(2)}
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="checkout-summary">
            <h3>Order Summary</h3>
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img src={item.videoThumbnail} alt={item.title} />
                  </div>
                  <div className="item-details">
                    <h4>{item.title}</h4>
                    <div className="item-controls">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="quantity-btn"
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="item-price">
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="remove-btn"
                      title="Remove item"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="total-line">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="total-line">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="total-line total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
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
              <div className="security-item">
                <i className="fas fa-undo"></i>
                <span>30-Day Refund</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Checkout;
