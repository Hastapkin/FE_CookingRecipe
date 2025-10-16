import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Order {
  orderId: number;
  totalAmount: number;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  paymentMethod: string;
  createdAt: string;
  items: Array<{
    orderItemId: number;
    recipeId: number;
    price: number;
    quantity: number;
    title: string;
    youtubeVideoId: string;
    videoThumbnail: string;
  }>;
}

function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'cancelled'>('all');

  // Sample data - replace with API call
  useEffect(() => {
    const sampleOrders: Order[] = [
      {
        orderId: 1,
        totalAmount: 11.98,
        status: 'paid',
        paymentMethod: 'stripe',
        createdAt: '2024-01-15T10:30:00Z',
        items: [
          {
            orderItemId: 1,
            recipeId: 1,
            price: 4.99,
            quantity: 1,
            title: 'Vietnamese Com Tam',
            youtubeVideoId: 'P50LW8SzfXQ',
            videoThumbnail: 'https://img.youtube.com/vi/P50LW8SzfXQ/maxresdefault.jpg'
          },
        ]
      }
    ];

    setTimeout(() => {
      setOrders(sampleOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'status-paid';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      case 'refunded': return 'status-refunded';
      default: return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return 'fas fa-check-circle';
      case 'pending': return 'fas fa-clock';
      case 'cancelled': return 'fas fa-times-circle';
      case 'refunded': return 'fas fa-undo';
      default: return 'fas fa-question-circle';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <main>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="orders-container">
        <div className="orders-header">
          <h1>My Orders</h1>
          <p>Track and manage your video recipe purchases</p>
        </div>

        <div className="orders-filters">
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Orders ({orders.length})
            </button>
            <button 
              className={`filter-tab ${filter === 'paid' ? 'active' : ''}`}
              onClick={() => setFilter('paid')}
            >
              Completed ({orders.filter(o => o.status === 'paid').length})
            </button>
            <button 
              className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({orders.filter(o => o.status === 'pending').length})
            </button>
            <button 
              className={`filter-tab ${filter === 'cancelled' ? 'active' : ''}`}
              onClick={() => setFilter('cancelled')}
            >
              Cancelled ({orders.filter(o => o.status === 'cancelled').length})
            </button>
          </div>
        </div>

        <div className="orders-list">
          {filteredOrders.length === 0 ? (
            <div className="empty-orders">
              <i className="fas fa-shopping-bag"></i>
              <h3>No orders found</h3>
              <p>
                {filter === 'all' 
                  ? "You haven't made any purchases yet. Start exploring our video recipes!"
                  : `No ${filter} orders found.`
                }
              </p>
              <Link to="/recipes" className="btn btn-primary">
                Browse Recipes
              </Link>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.orderId} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.orderId}</h3>
                    <div className="order-meta">
                      <span className="order-date">
                        <i className="fas fa-calendar"></i>
                        {formatDate(order.createdAt)}
                      </span>
                      <span className="order-total">
                        <i className="fas fa-dollar-sign"></i>
                        ${order.totalAmount.toFixed(2)}
                      </span>
                      <span className="order-method">
                        <i className="fas fa-credit-card"></i>
                        {order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="order-status">
                    <span className={`status-badge ${getStatusColor(order.status)}`}>
                      <i className={getStatusIcon(order.status)}></i>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  <h4>Purchased Items ({order.items.length})</h4>
                  <div className="items-grid">
                    {order.items.map(item => (
                      <div key={item.orderItemId} className="order-item">
                        <div className="item-thumbnail">
                          <img src={item.videoThumbnail} alt={item.title} />
                          <div className="play-overlay">
                            <i className="fas fa-play"></i>
                          </div>
                        </div>
                        <div className="item-details">
                          <h5>{item.title}</h5>
                          <div className="item-meta">
                            <span className="item-price">${item.price.toFixed(2)}</span>
                            <span className="item-quantity">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <div className="item-actions">
                          {order.status === 'paid' ? (
                            <Link 
                              to={`/recipe-detail/${item.recipeId}`}
                              className="btn btn-primary btn-small"
                            >
                              <i className="fas fa-play"></i> Watch
                            </Link>
                          ) : (
                            <button 
                              className="btn btn-outline btn-small"
                              disabled
                            >
                              <i className="fas fa-lock"></i> Locked
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="order-actions">
                  {order.status === 'paid' && (
                    <div className="action-group">
                      <Link 
                        to={`/recipe-detail/${order.items[0].recipeId}`}
                        className="btn btn-primary"
                      >
                        <i className="fas fa-play"></i> Watch All Recipes
                      </Link>
                      <button className="btn btn-outline">
                        <i className="fas fa-download"></i> Download Receipt
                      </button>
                    </div>
                  )}
                  {order.status === 'pending' && (
                    <div className="action-group">
                      <button className="btn btn-primary">
                        <i className="fas fa-credit-card"></i> Complete Payment
                      </button>
                      <button className="btn btn-outline">
                        <i className="fas fa-times"></i> Cancel Order
                      </button>
                    </div>
                  )}
                  {order.status === 'cancelled' && (
                    <div className="action-group">
                      <button className="btn btn-outline">
                        <i className="fas fa-redo"></i> Reorder
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="orders-summary">
          <div className="summary-card">
            <h3>Order Summary</h3>
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-label">Total Orders</span>
                <span className="stat-value">{orders.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Spent</span>
                <span className="stat-value">
                  ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Recipes Purchased</span>
                <span className="stat-value">
                  {orders.reduce((sum, order) => sum + order.items.length, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default MyOrders;
