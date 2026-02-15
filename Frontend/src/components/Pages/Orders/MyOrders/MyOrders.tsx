import React, { useState, useEffect } from 'react';
import type { ApiError, OrderResponse } from '../../../../models/OrderModels';
import { orderService } from '../../../../services/OrderService';
import './MyOrders.css';
interface MyOrdersProps {
  onAddOrder?: () => void;
}

const MyOrders: React.FC<MyOrdersProps> = ({ onAddOrder }) => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'created_at' | 'status'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError('');
      const fetchedOrders = await orderService.getMyOrders();
      setOrders(fetchedOrders);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.detail || 'Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchOrders();
  };

  const handleSort = (field: 'name' | 'created_at' | 'status') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedOrders = orders
    .filter(order => 
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'created_at':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case 'status':
          aValue = a.is_approved ? 'approved' : 'pending';
          bValue = b.is_approved ? 'approved' : 'pending';
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="sort-icon">
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      );
    }
    return sortOrder === 'asc' ? (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="sort-icon active">
        <path d="M7 14l5-5 5 5z"/>
      </svg>
    ) : (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="sort-icon active">
        <path d="M7 10l5 5 5-5z"/>
      </svg>
    );
  };

  return (
    <div className="my-orders-container">
      {/* Animated Background */}
      <div className="my-orders-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="my-orders-card">
        <div className="my-orders-header">
          <div className="my-orders-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20V6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4V4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
            </svg>
          </div>
          <h2>My Orders</h2>
          <p className="my-orders-subtitle">
            {orders.length > 0 ? `${orders.length} order${orders.length !== 1 ? 's' : ''} found` : 'No orders yet'}
          </p>
        </div>

        {/* Controls */}
        <div className="orders-controls">
          <div className="search-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="actions-wrapper">
            <button
              onClick={handleRefresh}
              className="btn-refresh"
              disabled={isLoading}
              title="Refresh orders"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className={isLoading ? 'spinning' : ''}>
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
              </svg>
            </button>
            
            {onAddOrder && (
              <button onClick={onAddOrder} className="btn-primary">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                Add Order
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {error && (
          <div className="error-message">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner large"></div>
            </div>
            <p>Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20V6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4V4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
              </svg>
            </div>
            <h3>No orders found</h3>
            <p>You haven't created any orders yet.</p>
            {onAddOrder && (
              <button onClick={onAddOrder} className="btn-primary">
                Create your first order
              </button>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')} className="sortable">
                    <span>Order Name</span>
                    {getSortIcon('name')}
                  </th>
                  <th className="description-col">Description</th>
                  <th onClick={() => handleSort('status')} className="sortable">
                    <span>Status</span>
                    {getSortIcon('status')}
                  </th>
                  <th onClick={() => handleSort('created_at')} className="sortable">
                    <span>Created</span>
                    {getSortIcon('created_at')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedOrders.map((order, index) => (
                  <tr key={order.id} style={{ animationDelay: `${index * 0.1}s` }}>
                    <td className="name-cell">
                      <strong>{order.name}</strong>
                    </td>
                    <td className="description-cell">
                      <span title={order.description}>
                        {order.description.length > 60 
                          ? `${order.description.substring(0, 60)}...` 
                          : order.description
                        }
                      </span>
                    </td>
                    <td className="status-cell">
                      <span className={`status-badge ${order.is_approved ? 'approved' : 'pending'}`}>
                        {order.is_approved ? (
                          <>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                            Approved
                          </>
                        ) : (
                          <>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7,13H17V11H7"/>
                            </svg>
                            Pending
                          </>
                        )}
                      </span>
                    </td>
                    <td className="date-cell">
                      {formatDate(order.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Results summary */}
        {!isLoading && orders.length > 0 && (
          <div className="results-summary">
            {searchTerm ? (
              <p>
                Showing {filteredAndSortedOrders.length} of {orders.length} orders
                {filteredAndSortedOrders.length === 0 && (
                  <span> - No orders match your search</span>
                )}
              </p>
            ) : (
              <p>Showing all {orders.length} orders</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
