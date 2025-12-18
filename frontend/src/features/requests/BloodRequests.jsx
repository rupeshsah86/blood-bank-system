import { useState, useEffect } from 'react';
import { bloodService } from '../blood/bloodService';
import { authService } from '../auth/authService';
import Loader from '../../components/Loader';
import FormField from '../../components/FormField';
import { useFormValidation, validators } from '../../utils/validation';
import { showToast } from '../../components/ToastContainer';
import './BloodRequests.css';

const BloodRequests = ({ userRole }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const initialFormValues = {
    bloodGroup: '',
    quantity: '',
    urgency: 'medium',
    hospital: '',
    patientName: ''
  };

  const formValidationRules = {
    bloodGroup: [validators.required, validators.bloodType],
    quantity: [validators.required],
    urgency: [validators.required],
    hospital: [validators.required, validators.minLength(2)],
    patientName: [validators.required, validators.minLength(2)]
  };

  const { values: formData, errors: formErrors, handleChange: handleFormChange, handleBlur: handleFormBlur, validateAll: validateForm, reset: resetForm } = useFormValidation(initialFormValues, formValidationRules);

  const bloodGroups = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ];
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
      const user = authService.getCurrentUser();
      
      // Use appropriate endpoint based on user role
      const response = (user?.role === 'admin' || user?.role === 'hospital') 
        ? await bloodService.getBloodRequests()
        : await bloodService.getUserRequests();
      
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
    
    if (!validateForm()) {
      showToast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await bloodService.createBloodRequest(formData);
      showToast.success('Blood request created successfully!');
      resetForm();
      setShowCreateForm(false);
      loadRequests();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to create request';
      setError(errorMsg);
      showToast.error(errorMsg);
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
          <h2>{userRole === 'donor' ? 'My Blood Requests' : 'Blood Requests'}</h2>
          <p>{userRole === 'donor' ? 'View your blood request history' : 'Manage blood requests and emergency needs'}</p>
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
              <FormField
                label="Blood Group Needed"
                type="select"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleFormChange}
                onBlur={handleFormBlur}
                error={formErrors.bloodGroup}
                required
                options={bloodGroups}
                className="form-group"
              />
              
              <FormField
                label="Quantity (units)"
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleFormChange}
                onBlur={handleFormBlur}
                error={formErrors.quantity}
                required
                placeholder="Number of units needed"
                className="form-group"
              />
            </div>
            
            <div className="form-row">
              <FormField
                label="Urgency Level"
                type="select"
                name="urgency"
                value={formData.urgency}
                onChange={handleFormChange}
                onBlur={handleFormBlur}
                error={formErrors.urgency}
                required
                options={urgencyLevels}
                className="form-group"
              />
              
              <FormField
                label="Hospital/Medical Center"
                name="hospital"
                value={formData.hospital}
                onChange={handleFormChange}
                onBlur={handleFormBlur}
                error={formErrors.hospital}
                required
                placeholder="Hospital name"
                className="form-group"
              />
            </div>
            
            <FormField
              label="Patient Name"
              name="patientName"
              value={formData.patientName}
              onChange={handleFormChange}
              onBlur={handleFormBlur}
              error={formErrors.patientName}
              required
              placeholder="Patient's full name"
            />
            
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