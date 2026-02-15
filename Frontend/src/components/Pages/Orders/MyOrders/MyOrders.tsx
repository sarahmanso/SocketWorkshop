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


  const filteredAndSortedOrders = orders


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      </div>
    </div>
  );
};

export default MyOrders;
