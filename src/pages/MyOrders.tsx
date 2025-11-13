import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getTransactions, getTransaction } from '../services/transactions'
import { getUserSession } from '../services/auth'

interface OrderItem {
  recipeId: number
  title: string
  price: number
  videoThumbnail?: string | null
}

interface Order {
  id: number
  totalAmount: number
  status: 'pending' | 'verified' | 'rejected'
  paymentMethod?: string | null
  createdAt: string
  adminNotes?: string | null
  items: OrderItem[]
}

function MyOrders() {
  const navigate = useNavigate()
  const [allOrders, setAllOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all')

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      const session = getUserSession()
      if (!session) {
        navigate('/login')
        return
      }

      // Always get all transactions to show correct counts
      const transactions = await getTransactions()

      // Fetch details for each transaction to get recipe information
      const ordersWithDetails = await Promise.all(
        transactions.map(async (transaction) => {
          const detail = await getTransaction(transaction.id)
          return {
            id: detail.id,
            totalAmount: detail.totalAmount,
            status: detail.status,
            paymentMethod: detail.paymentMethod,
            createdAt: detail.createdAt,
            adminNotes: detail.adminNotes,
            items: detail.recipes || []
          } as Order
        })
      )

      setAllOrders(ordersWithDetails)
    } catch (err) {
      console.error('Failed to load orders:', err)
      setError(err instanceof Error ? err.message : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = allOrders.filter(order => {
    if (filter === 'all') return true
    return order.status === filter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'status-paid'
      case 'pending': return 'status-pending'
      case 'rejected': return 'status-cancelled'
      default: return ''
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return 'fas fa-check-circle'
      case 'pending': return 'fas fa-clock'
      case 'rejected': return 'fas fa-times-circle'
      default: return 'fas fa-question-circle'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'verified': return 'Paid'
      case 'pending': return 'Pending'
      case 'rejected': return 'Rejected'
      default: return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <main>
        <section className="page-header">
          <div className="container">
            <h1 className="page-title">My Orders</h1>
            <p className="page-subtitle">Track and manage your video recipe purchases</p>
          </div>
        </section>

        <div className="orders-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main>
        <section className="page-header">
          <div className="container">
            <h1 className="page-title">My Orders</h1>
            <p className="page-subtitle">Track and manage your video recipe purchases</p>
          </div>
        </section>

        <div className="orders-container">
          <div className="empty-orders">
            <i className="fas fa-exclamation-triangle"></i>
            <h3>Error loading orders</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={loadOrders}>
              Try Again
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
          <h1 className="page-title">My Orders</h1>
          <p className="page-subtitle">Track and manage your video recipe purchases</p>
        </div>
      </section>

      <div className="orders-container">

        <div className="orders-filters">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Orders ({allOrders.length})
            </button>
            <button
              className={`filter-tab ${filter === 'verified' ? 'active' : ''}`}
              onClick={() => setFilter('verified')}
            >
              Completed ({allOrders.filter(o => o.status === 'verified').length})
            </button>
            <button
              className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({allOrders.filter(o => o.status === 'pending').length})
            </button>
            <button
              className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`}
              onClick={() => setFilter('rejected')}
            >
              Rejected ({allOrders.filter(o => o.status === 'rejected').length})
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
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.id}</h3>
                    <div className="order-meta">
                      <span className="order-date">
                        <i className="fas fa-calendar"></i>
                        {formatDate(order.createdAt)}
                      </span>
                      <span className="order-total">
                        <i className="fas fa-dollar-sign"></i>
                        ${order.totalAmount.toFixed(2)}
                      </span>
                      {order.paymentMethod && (
                        <span className="order-method">
                          <i className="fas fa-credit-card"></i>
                          {order.paymentMethod}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="order-status">
                    <span className={`status-badge ${getStatusColor(order.status)}`}>
                      <i className={getStatusIcon(order.status)}></i>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  <h4>Purchased Items ({order.items.length})</h4>
                  <div className="items-grid">
                    {order.items.map(item => (
                      <div key={item.recipeId} className="order-item">
                        <div className="item-details">
                          <h5>{item.title}</h5>
                          <div className="item-meta">
                            <span className="item-price">${item.price.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="item-actions">
                          {order.status === 'verified' ? (
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
                  {order.status === 'verified' && order.items.length > 0 && (
                    <div className="action-group">
                      <Link
                        to={`/recipe-detail/${order.items[0].recipeId}`}
                        className="btn btn-primary"
                      >
                        <i className="fas fa-play"></i> Watch
                      </Link>
                    </div>
                  )}
                  {order.status === 'pending' && (
                    <div className="action-group">
                      <p className="pending-message">
                        <i className="fas fa-info-circle"></i>
                        Waiting for admin verification
                      </p>
                    </div>
                  )}
                  {order.status === 'rejected' && (
                    <div className="action-group">
                      <p className="rejected-message">
                        <i className="fas fa-exclamation-circle"></i>
                        {order.adminNotes || 'Payment was rejected. Please contact support.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}

export default MyOrders
