import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Transaction } from '../../services/transactions'
import { getAllTransactions } from '../../services/transactions'
import { getUserSession } from '../../services/auth'

function AdminTransactions() {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('pending')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  })

  const session = getUserSession()
  const isAdmin = (session?.user.role || '').toLowerCase() === 'admin'

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const status = statusFilter === 'all' ? undefined : statusFilter
      const result = await getAllTransactions(status, pagination.page, pagination.limit)
      setTransactions(result.transactions)
      setPagination(result.pagination)
    } catch (err) {
      console.error('Failed to load transactions', err)
      setError('Failed to load transactions. Please try again later.')
    } finally {
      setLoading(false)
    }
  }, [statusFilter, pagination.page, pagination.limit])

  useEffect(() => {
    if (!session) {
      navigate('/login')
      return
    }

    if (!isAdmin) {
      navigate('/')
      return
    }

    loadTransactions()
  }, [isAdmin, navigate, session?.user?.id, loadTransactions])

  const handleStatusFilterChange = (newStatus: 'all' | 'pending' | 'verified' | 'rejected') => {
    setStatusFilter(newStatus)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleViewProof = (proofUrl: string) => {
    if (proofUrl) {
      window.open(proofUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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
      case 'verified': return 'Verified'
      case 'pending': return 'Pending'
      case 'rejected': return 'Rejected'
      default: return status
    }
  }

  if (!isAdmin) {
    return null
  }

  return (
    <main className="admin-page">
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Manage Transactions</h1>
          <p className="page-subtitle">View and manage all transactions in the system</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="admin-transactions-filters">
            <div className="filter-tabs">
              <button
                className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleStatusFilterChange('all')}
              >
                All
              </button>
              <button
                className={`filter-tab ${statusFilter === 'pending' ? 'active' : ''}`}
                onClick={() => handleStatusFilterChange('pending')}
              >
                Pending
              </button>
              <button
                className={`filter-tab ${statusFilter === 'verified' ? 'active' : ''}`}
                onClick={() => handleStatusFilterChange('verified')}
              >
                Verified
              </button>
              <button
                className={`filter-tab ${statusFilter === 'rejected' ? 'active' : ''}`}
                onClick={() => handleStatusFilterChange('rejected')}
              >
                Rejected
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner large"></div>
              <p>Loading transactions...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={loadTransactions}>
                Try Again
              </button>
            </div>
          ) : transactions.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-receipt"></i>
              <h3>No transactions found</h3>
              <p>
                {statusFilter === 'all'
                  ? 'No transactions in the system yet.'
                  : `No ${statusFilter} transactions found.`
                }
              </p>
            </div>
          ) : (
            <>
              <div className="admin-transactions-table">
                <div className="table-header">
                  <span>ID</span>
                  <span>User ID</span>
                  <span>Amount</span>
                  <span>Payment Method</span>
                  <span>Status</span>
                  <span>Date</span>
                  <span>Recipes</span>
                  <span>Actions</span>
                </div>
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="table-row">
                    <span>#{transaction.id}</span>
                    <span>{transaction.userId}</span>
                    <span>${transaction.totalAmount.toFixed(2)}</span>
                    <span>{transaction.paymentMethod || '—'}</span>
                    <span>
                      <span className={`status-badge ${getStatusColor(transaction.status)}`}>
                        <i className={getStatusIcon(transaction.status)}></i>
                        {getStatusLabel(transaction.status)}
                      </span>
                    </span>
                    <span>{formatDate(transaction.createdAt)}</span>
                    <span>{transaction.recipeCount || transaction.recipes?.length || 0}</span>
                    <span>
                      {transaction.paymentProof && 
                       typeof transaction.paymentProof === 'string' && 
                       transaction.paymentProof.trim() !== '' ? (
                        <button
                          className="btn btn-outline btn-small"
                          onClick={() => handleViewProof(transaction.paymentProof!)}
                          title="View payment proof"
                        >
                          <i className="fas fa-image"></i> View Proof
                        </button>
                      ) : (
                        <span className="text-muted">No proof</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn prev"
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                    disabled={pagination.page === 1}
                  >
                    <i className="fas fa-chevron-left"></i> Previous
                  </button>
                  <div className="pagination-info">
                    Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                  </div>
                  <button
                    className="pagination-btn next"
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Next <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  )
}

export default AdminTransactions

