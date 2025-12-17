import { useState, useEffect } from 'react';
import { bloodService } from '../blood/bloodService';
import { authService } from '../auth/authService';
import Loader from '../../components/Loader';
import FormField from '../../components/FormField';
import { useFormValidation, validators } from '../../utils/validation';
import { showToast } from '../../components/ToastContainer';
import './UserBloodRequest.css';

const UserBloodRequest = () => {
  const [userRequests, setUserRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
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
    { value: 'low', label: 'Low Priority', color: '#059669' },
    { value: 'medium', label: 'Medium Priority', color: '#d97706' },
    { value: 'high', label: 'High Priority', color: '#dc2626' },
    { value: 'critical', label: 'Critical/Emergency', color: '#991b1b' }
  ];

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    loadUserRequests();
  }, []);

  const loadUserRequests = async () => {
    try {
      setError('');
      const response = await bloodService.getBloodRequests();
      const allRequests = response?.success ? response.data : (Array.isArray(response) ? response : []);
      
      // Filter requests for current user
      const user = authService.getCurrentUser();
      const filteredRequests = allRequests.filter(request => 
        request.requester?._id === user?.id || request.requester === user?.id
      );
      
      setUserRequests(filteredRequests);
    } catch (error) {
      console.error('Error loading user requests:', error);
      setError('Failed to load your requests');
      setUserRequests([]);
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
      showToast.success('Blood request submitted successfully! We will process it shortly.');
      resetForm();
      setShowCreateForm(false);
      loadUserRequests();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to submit request';
      setError(errorMsg);
      showToast.error(errorMsg);
    } finally {
      setLoading(false);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'approved': return '✅';
      case 'rejected': return '❌';
      case 'fulfilled': return '🩸';
      default: return '📋';
    }
  };

  if (loading && userRequests.length === 0) {
    return (
      <div className="user-blood-request">
        <Loader />
      </div>
    );
  }

  return (
    <div className="user-blood-request">
      <div className="section-header">
        <div className="header-content">
          <h2>My Blood Requests</h2>
          <p>Request blood for yourself or family members</p>
        </div>
        <button 
          className="btn btn-primary request-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <span className="btn-icon">🩸</span>
          {showCreateForm ? 'Cancel Request' : 'Request Blood'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
          <button onClick={loadUserRequests} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {showCreateForm && (
        <div className="create-request-form">
          <div className="form-header">
            <h3>Submit Blood Request</h3>
            <p>Fill out the form below to request blood. Our team will review and process your request.</p>
          </div>
          
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
                min="1"
                max="10"
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
                placeholder="Hospital or clinic name"
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
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <Loader /> : 'Submit Request'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="requests-section">
        <div className="section-title">
          <h3>Request History</h3>
          <span className="request-count">{userRequests.length} requests</span>
        </div>

        {userRequests.length === 0 ? (
          <div className="no-requests">
            <div className="no-requests-icon">🩸</div>
            <h4>No Blood Requests Yet</h4>
            <p>You haven't submitted any blood requests. Click "Request Blood" to get started.</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateForm(true)}
            >
              Make Your First Request
            </button>
          </div>
        ) : (
          <div className="requests-grid">
            {userRequests.map(request => (
              <div key={request._id} className="request-card">
                <div className="request-header">
                  <div className="request-badges">
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
                  <div className="request-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(request.status) }}
                    >
                      {getStatusIcon(request.status)} {request.status}
                    </span>
                  </div>
                </div>
                
                <div className="request-details">
                  <h4>{request.patientName}</h4>
                  <div className="detail-row">
                    <span className="detail-label">Hospital:</span>
                    <span className="detail-value">{request.hospital}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Quantity:</span>
                    <span className="detail-value">{request.quantity} units</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Requested:</span>
                    <span className="detail-value">{new Date(request.requestDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="request-timeline">
                  <div className={`timeline-step ${request.status !== 'pending' ? 'completed' : 'active'}`}>
                    <div className="step-icon">📋</div>
                    <div className="step-content">
                      <div className="step-title">Request Submitted</div>
                      <div className="step-date">{new Date(request.requestDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  <div className={`timeline-step ${request.status === 'approved' || request.status === 'fulfilled' ? 'completed' : request.status === 'rejected' ? 'rejected' : ''}`}>
                    <div className="step-icon">
                      {request.status === 'approved' || request.status === 'fulfilled' ? '✅' : 
                       request.status === 'rejected' ? '❌' : '⏳'}
                    </div>
                    <div className="step-content">
                      <div className="step-title">
                        {request.status === 'approved' ? 'Request Approved' :
                         request.status === 'rejected' ? 'Request Rejected' :
                         request.status === 'fulfilled' ? 'Request Approved' : 'Under Review'}
                      </div>
                    </div>
                  </div>
                  
                  {(request.status === 'approved' || request.status === 'fulfilled') && (
                    <div className={`timeline-step ${request.status === 'fulfilled' ? 'completed' : ''}`}>
                      <div className="step-icon">{request.status === 'fulfilled' ? '🩸' : '🏥'}</div>
                      <div className="step-content">
                        <div className="step-title">
                          {request.status === 'fulfilled' ? 'Blood Delivered' : 'Preparing Blood'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBloodRequest;