import { useState, useEffect } from 'react';
import { bloodService } from './bloodService';
import Loader from '../../components/Loader';
import './Blood.css';

const BloodStock = ({ userRole, onStockUpdated }) => {
  const [bloodStock, setBloodStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    bloodGroup: '',
    quantity: '',
    location: '',
    expiryDate: ''
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    loadBloodStock();
  }, []);

  const loadBloodStock = async () => {
    try {
      const response = await bloodService.getBloodStock();
      setBloodStock(response.data || []);
    } catch (error) {
      setError('Failed to load blood stock');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await bloodService.addBloodStock(formData);
      setFormData({ bloodGroup: '', quantity: '', location: '', expiryDate: '' });
      setShowAddForm(false);
      loadBloodStock();
      if (onStockUpdated) onStockUpdated();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add blood stock');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#059669';
      case 'low': return '#d97706';
      case 'out_of_stock': return '#dc2626';
      default: return '#6b7280';
    }
  };

  if (loading && bloodStock.length === 0) {
    return (
      <div className="blood-stock">
        <Loader />
      </div>
    );
  }

  return (
    <div className="blood-stock">
      <div className="section-header">
        <div>
          <h2>Blood Stock Management</h2>
          <p>Monitor and manage blood inventory</p>
        </div>
        {userRole === 'admin' && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : 'Add Blood Stock'}
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showAddForm && userRole === 'admin' && (
        <div className="add-stock-form">
          <h3>Add New Blood Stock</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Blood Group</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                  required
                >
                  <option value="">Select blood group</option>
                  {bloodGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Quantity (units)</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  required
                  min="1"
                  placeholder="Enter quantity"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                  placeholder="Storage location"
                />
              </div>
              
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <Loader /> : 'Add Stock'}
            </button>
          </form>
        </div>
      )}

      <div className="stock-grid">
        {bloodStock.length === 0 ? (
          <div className="no-stock">
            <p>No blood stock available.</p>
          </div>
        ) : (
          bloodStock.map(stock => (
            <div key={stock._id} className="stock-card">
              <div className="stock-header">
                <span className={`blood-type ${stock.bloodGroup.replace('+', 'pos').replace('-', 'neg')}`}>
                  {stock.bloodGroup}
                </span>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(stock.status) }}
                >
                  {stock.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="stock-info">
                <div className="quantity">
                  <span className="number">{stock.quantity}</span>
                  <span className="label">Units Available</span>
                </div>
                
                <div className="details">
                  <p><strong>Location:</strong> {stock.location}</p>
                  <p><strong>Expires:</strong> {new Date(stock.expiryDate).toLocaleDateString()}</p>
                  <p><strong>Added:</strong> {new Date(stock.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BloodStock;