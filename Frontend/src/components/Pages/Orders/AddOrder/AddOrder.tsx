// components/AddOrder.tsx
import React, { useState } from 'react';
import './AddOrder.css'
import type { ApiError, OrderCreate } from '../../../../models/OrderModels';
import { orderService } from '../../../../services/OrderService';
import { useNavigate } from 'react-router-dom';

interface AddOrderProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddOrder: React.FC<AddOrderProps> = ({ onSuccess, onCancel }) => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState<OrderCreate>({
    name: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Order name is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Order description is required');
      return false;
    }
    if (formData.name.length > 100) {
      setError('Order name must be less than 100 characters');
      return false;
    }
    if (formData.description.length > 500) {
      setError('Order description must be less than 500 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      await orderService.createOrder(formData);
      setSuccess(true);
      setFormData({ name: '', description: '' });
      navigate('/my-orders');
      
      setTimeout(() => {
        onSuccess?.();
        setSuccess(false);
      }, 1500);
      
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.detail || 'Failed to create order');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: '', description: '' });
    setError('');
    setSuccess(false);
  };

  const getCharCountClass = (count: number, max: number) => {
    if (count > max * 0.9) return 'char-count danger';
    if (count > max * 0.75) return 'char-count warning';
    return 'char-count';
  };

  return (
    <div className="add-order-container">
      <div className="add-order-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="add-order-card">
        <div className="add-order-header">
          <div className="add-order-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </div>
          <h2>Create New Order</h2>
          <p className="add-order-subtitle">Fill in the details below to create your order</p>
        </div>
        
        {success && (
          <div className="success-message">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            Order created successfully!
          </div>
        )}

        {error && (
          <div className="error-message">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-order-form">
          <div className="form-group">
            <label htmlFor="name">Order Name *</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20V6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4V4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
              </svg>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter order name"
                maxLength={100}
                disabled={isLoading}
                required
              />
            </div>
            <small className={getCharCountClass(formData.name.length, 100)}>
              {formData.name.length}/100 characters
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z"/>
              </svg>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter order description"
                maxLength={500}
                disabled={isLoading}
                required
              />
            </div>
            <small className={getCharCountClass(formData.description.length, 500)}>
              {formData.description.length}/500 characters
            </small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary"
              disabled={isLoading}
            >
              Reset
            </button>
            
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="btn-cancel"
                disabled={isLoading}
              >
                Cancel
              </button>
            )}
            
            <button
              type="submit"
              className={`btn-primary ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || !formData.name.trim() || !formData.description.trim()}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Creating...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  Create Order
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrder;
