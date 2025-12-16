import { useState, useEffect } from 'react';
import { bloodService } from '../blood/bloodService';
import { authService } from '../auth/authService';
import Loader from '../../components/Loader';
import './BloodRequests.css';

const BloodRequests = ({ userRole }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    bloodGroup: '',
    quantity: '',
    urgency: 'medium',
    hospital: '',
    patientName: ''
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = [
    { value: 'low', label: 'Low', color: '#059669' },
    { value: 'medium', label: 'Medium', color: '#d97706' },
    { value: 'high', label: 'High', color: '#dc2626' },
    { value: 'critical', label: 'Critical', color: '#991b1b' }
  ];

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setError('');
      const response = await bloodService.getBloodRequests();
      
      if (response && response.success && response.data) {
        setRequests(response.data);
      } else if (response && Array.isArray(response)) {
        setRequests(response);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error('Error loading requests:', error);
      if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please make sure the backend is running.');
      } else if (error.response?.status === 401) {
        setError('Please login to view requests');
      } else if (error.response?.status === 403) {
        setError('You do not have permission to view requests');
      } else {
        setError(error.response?.data?.message || 'Failed to load requests');
      }
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await bloodService.createBloodRequest(formData);
      setFormData({
        bloodGroup: '',
        quantity: '',
        urgency: 'medium',
        hospital: '',
        patientName: ''
      });
      setShowCreateForm(false);
      loadRequests();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      await bloodService.updateRequestStatus(requestId, newStatus);
      loadRequests();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update request status');
    }
  };

  const getUrgencyColor = (urgency) => {
    const level = urgencyLevels.find(l => l.value === urgency);
    return level ? level.color : '#6b7280';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#d97706';
      case 'approved': return '#059669';
      case 'rejected': return '#dc2626';
      case 'fulfilled': return '#2563eb';
      default: return '#6b7280';
    }
  };

  if (loading && requests.length === 0) {
    return (
      <div className="blood-requests">
        <Loader />
      </div>
    );
  }

  return (
    <div className="blood-requests">
      <div className="section-header">
        <div>
          <h2>Blood Requests</h2>
          <p>Manage blood requests and emergency needs</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : 'Create Request'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button 
            onClick={loadRequests} 
            className="retry-btn"
            style={{ marginLeft: '10px', padding: '4px 8px', fontSize: '0.75rem' }}
          >
            Retry
          </button>
        </div>
      )}

      {showCreateForm && (
        <div className="create-request-form">
          <h3>Create Blood Request</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Blood Group Needed</label>
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
                  placeholder="Number of units needed"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Urgency Level</label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                  required
                >
                  {urgencyLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Hospital/Medical Center</label>
                <input
                  type="text"
                  value={formData.hospital}
                  onChange={(e) => setFormData({...formData, hospital: e.target.value})}
                  required
                  placeholder="Hospital name"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Patient Name</label>
              <input
                type="text"
                value={formData.patientName}
                onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                required
                placeholder="Patient's full name"
              />
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <Loader /> : 'Submit Request'}
            </button>
          </form>
        </div>
      )}

      <div className="requests-list">
        {requests.length === 0 ? (
          <div className="no-requests">
            <p>No blood requests found.</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginTop: '8px' }}>
              Create a new request using the button above.
            </p>
          </div>
        ) : (
          <div className="requests-grid">
            {requests.map(request => (
              <div key={request._id} className="request-card">
                <div className="request-header">
                  <div className="request-info">
                    <span className={`blood-badge ${request.bloodGroup.replace('+', 'pos').replace('-', 'neg')}`}>
                      {request.bloodGroup}
                    </span>
                    <span 
                      className="urgency-badge"
                      style={{ backgroundColor: getUrgencyColor(request.urgency) }}
                    >
                      {request.urgency}
                    </span>
                  </div>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(request.status) }}
                  >
                    {request.status}
                  </span>
                </div>
                
                <div className="request-details">
                  <h4>{request.patientName}</h4>
                  <p><strong>Hospital:</strong> {request.hospital}</p>
                  <p><strong>Quantity:</strong> {request.quantity} units</p>
                  <p><strong>Requested by:</strong> {request.requester?.name || 'Unknown'}</p>
                  <p><strong>Date:</strong> {new Date(request.requestDate).toLocaleDateString()}</p>
                </div>

                {userRole === 'admin' && request.status === 'pending' && (
                  <div className="request-actions">
                    <button 
                      className="btn btn-sm btn-success"
                      onClick={() => handleStatusUpdate(request._id, 'approved')}
                    >
                      Approve
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleStatusUpdate(request._id, 'rejected')}
                    >
                      Reject
                    </button>
                  </div>
                )}

                {userRole === 'admin' && request.status === 'approved' && (
                  <div className="request-actions">
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => handleStatusUpdate(request._id, 'fulfilled')}
                    >
                      Mark Fulfilled
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BloodRequests;