import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../../services/AuthService';
import orderActivityService from '../../../services/OrderActivityService';
import { orderService } from '../../../services/OrderService';
import './OrderActivity.css';
import type { OrderActivityModel } from '../../../models/OrderActivityModels';

const OrderActivity: React.FC = () => {
  const [activities, setActivities] = useState<OrderActivityModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [approvingOrderId, setApprovingOrderId] = useState<number | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const data = await orderActivityService.getAllActivities();
      setActivities(data);
    } catch (err) {
      setError('Error fetching activities');
      console.error('Error fetching activities:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveOrder = async (orderId: number) => {
    try {
      setApprovingOrderId(orderId);
      setError('');
      
      await orderService.approveOrder(orderId);
      
      // Update the local state to reflect the approval
      setActivities(prevActivities =>
        prevActivities.map(activity =>
          activity.order_id === orderId
            ? {
                ...activity,
                order: { ...activity.order, is_approved: true }
              }
            : activity
        )
      );
    } catch (err) {
      setError('Error approving order');
      console.error('Error approving order:', err);
    } finally {
      setApprovingOrderId(null);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="page-content">
      <div className="content-container">
        <div className="page-header">
          <div className="header-content">
            <h1>Order Activity</h1>
            <p className="page-description">Historical activities and orders in the system</p>
          </div>
          <button onClick={fetchActivities} className="refresh-button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
            Refresh
          </button>
        </div>

        {error && (
          <div className="error-banner">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading activities...</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Username</th>
                  <th>Order ID</th>
                  <th>Order Name</th>
                  <th>Activity Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="empty-state">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p>No activities to display</p>
                    </td>
                  </tr>
                ) : (
                  activities.map((activity) => (
                    <tr key={activity.id}>
                      <td className="id-cell">{activity.user_id}</td>
                      <td className="name-cell">{activity.user.username}</td>
                      <td className="id-cell">{activity.order_id}</td>
                      <td className="order-cell">{activity.order.name}</td>
                      <td className="time-cell">{formatDateTime(activity.activity_time)}</td>
                      <td className="status-cell">
                        {activity.order.is_approved ? (
                          <span className="status-badge approved">
                            <svg viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Approved
                          </span>
                        ) : (
                          <span className="status-badge pending">
                            <svg viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="action-cell">
                        {!activity.order.is_approved ? (
                          <button
                            onClick={() => handleApproveOrder(activity.order_id)}
                            disabled={approvingOrderId === activity.order_id}
                            className="approve-button"
                            title="Approve order"
                          >
                            {approvingOrderId === activity.order_id ? (
                              <div className="spinner-small"></div>
                            ) : (
                              <svg viewBox="0 0 20 20" fill="white">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        ) : (
                          <span className="approved-icon">✓</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activities.length > 0 && (
          <div className="table-footer">
            <p className="result-count">
              Total: {activities.length} activities
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderActivity;