import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../../services/AuthService';
import orderActivityService from '../../../services/OrderActivityService';
import './OrderActivity.css';
import type { OrderActivityModel } from '../../../models/OrderActivityModels';




const OrderActivity: React.FC = () => {
  const [activities, setActivities] = useState<OrderActivityModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-state">
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