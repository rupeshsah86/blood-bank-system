import { useState, useEffect } from 'react';
import { bloodService } from '../blood/bloodService';
import { donorService } from '../donor/donorService';
import { authService } from '../auth/authService';
import Loader from '../../components/Loader';
import FormField from '../../components/FormField';
import { useFormValidation, validators } from '../../utils/validation';
import { showToast } from '../../components/ToastContainer';
import PatientRequestCard from './PatientRequestCard';
import RequestCardSkeleton from './RequestCardSkeleton';
import HospitalDataDebug from './HospitalDataDebug';
import './HospitalRequests.css';

const HospitalRequests = () => {
  const [hospitalRequests, setHospitalRequests] = useState([]);
  const [availableDonors, setAvailableDonors] = useState([]);
  const [bloodStock, setBloodStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [donorsLoading, setDonorsLoading] = useState(false);
  const [stockLoading, setStockLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeView, setActiveView] = useState('requests');
  const [donorFilter, setDonorFilter] = useState('');
  const [debugMode, setDebugMode] = useState(false);
  
  const initialFormValues = {
    bloodGroup: '',
    quantity: '',
    urgency: 'medium',
    hospital: '',
    patientName: '',
    patientAge: '',
    medicalCondition: '',
    contactNumber: ''
  };

  const formValidationRules = {
    bloodGroup: [validators.required, validators.bloodType],
    quantity: [validators.required],
    urgency: [validators.required],
    hospital: [validators.required, validators.minLength(2)],
    patientName: [validators.required, validators.minLength(2)],
    contactNumber: [validators.required, validators.minLength(10)]
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
    { value: 'low', label: 'Routine', color: '#059669' },
    { value: 'medium', label: 'Urgent', color: '#d97706' },
    { value: 'high', label: 'Very Urgent', color: '#dc2626' },
    { value: 'critical', label: 'Life-threatening', color: '#991b1b' }
  ];

  useEffect(() => {
    loadHospitalData();
    // Auto-fill hospital name from current user
    const user = authService.getCurrentUser();
    if (user && user.name) {
      handleFormChange({ target: { name: 'hospital', value: user.name } });
    }
  }, []);

  const loadHospitalData = async () => {
    try {
      setError('');
      setLoading(true);
      
      // Load requests
      setRequestsLoading(true);
      const requestsRes = await bloodService.getBloodRequests().catch(err => {
        console.log('Requests API error:', err);
        return { data: [] };
      });
      
      // For hospitals, show all requests (they manage patient requests)
      const user = authService.getCurrentUser();
      const allRequests = requestsRes?.success ? requestsRes.data : (Array.isArray(requestsRes) ? requestsRes : []);
      
      // Hospitals should see all requests to manage patient blood needs
      // If you want to filter by hospital name, you can add that logic here
      setHospitalRequests(allRequests);
      setRequestsLoading(false);
      
      // Load donors
      setDonorsLoading(true);
      const donorsRes = await donorService.getDonors().catch(err => {
        console.log('Donors API error:', err);
        return { data: [] };
      });
      const allDonors = donorsRes?.success ? donorsRes.data : (Array.isArray(donorsRes) ? donorsRes : []);
      setAvailableDonors(allDonors.filter(donor => donor.isAvailable !== false));
      setDonorsLoading(false);
      
      // Load blood stock
      setStockLoading(true);
      const stockRes = await bloodService.getBloodStock().catch(err => {
        console.log('Stock API error:', err);
        return { data: [] };
      });
      const allStock = stockRes?.success ? stockRes.data : (Array.isArray(stockRes) ? stockRes : []);
      setBloodStock(allStock);
      setStockLoading(false);
      
    } catch (error) {
      console.error('Error loading hospital data:', error);
      setError('Failed to load hospital data');
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
      showToast.success('Patient blood request submitted successfully!');
      resetForm();
      setShowCreateForm(false);
      loadHospitalData();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to submit request';
      setError(errorMsg);
      showToast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getCompatibleDonors = (bloodGroup) => {
    const compatibility = {
      'A+': ['A+', 'A-', 'O+', 'O-'],
      'A-': ['A-', 'O-'],
      'B+': ['B+', 'B-', 'O+', 'O-'],
      'B-': ['B-', 'O-'],
      'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      'AB-': ['A-', 'B-', 'AB-', 'O-'],
      'O+': ['O+', 'O-'],
      'O-': ['O-']
    };
    
    const compatibleGroups = compatibility[bloodGroup] || [];
    return availableDonors.filter(donor => compatibleGroups.includes(donor.bloodGroup));
  };

  const getBloodStockByGroup = (bloodGroup) => {
    return bloodStock.filter(stock => stock.bloodGroup === bloodGroup);
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

  if (loading && hospitalRequests.length === 0) {
    return (
      <div className="hospital-requests">
        <Loader />
      </div>
    );
  }

  return (
    <div className="hospital-requests">
      <div className="section-header">
        <div className="header-content">
          <h2>Hospital Blood Management</h2>
          <p>Manage patient blood requests and view availability</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-secondary debug-btn"
            onClick={() => setDebugMode(!debugMode)}
            title="Toggle debug mode"
          >
            🔍 Debug
          </button>
          <button 
            className="btn btn-primary request-btn"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            <span className="btn-icon">🏥</span>
            {showCreateForm ? 'Cancel' : 'New Patient Request'}
          </button>
        </div>
      </div>

      <div className="view-tabs">
        <button 
          className={`tab ${activeView === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveView('requests')}
        >
          <span className="tab-icon">📋</span>
          Patient Requests
        </button>
        <button 
          className={`tab ${activeView === 'availability' ? 'active' : ''}`}
          onClick={() => setActiveView('availability')}
        >
          <span className="tab-icon">🩸</span>
          Blood Availability
        </button>
        <button 
          className={`tab ${activeView === 'donors' ? 'active' : ''}`}
          onClick={() => setActiveView('donors')}
        >
          <span className="tab-icon">👥</span>
          Available Donors
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
          <button onClick={loadHospitalData} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {showCreateForm && (
        <div className="create-request-form">
          <div className="form-header">
            <h3>Submit Patient Blood Request</h3>
            <p>Complete patient information for blood request processing</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h4>Patient Information</h4>
              <div className="form-row">
                <FormField
                  label="Patient Name"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleFormChange}
                  onBlur={handleFormBlur}
                  error={formErrors.patientName}
                  required
                  placeholder="Patient's full name"
                  className="form-group"
                />
                
                <FormField
                  label="Contact Number"
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleFormChange}
                  onBlur={handleFormBlur}
                  error={formErrors.contactNumber}
                  required
                  placeholder="Patient/Family contact number"
                  className="form-group"
                />
              </div>
              
              <div className="form-row">
                <FormField
                  label="Patient Age (Optional)"
                  type="number"
                  name="patientAge"
                  value={formData.patientAge}
                  onChange={handleFormChange}
                  onBlur={handleFormBlur}
                  error={formErrors.patientAge}
                  min="1"
                  max="120"
                  placeholder="Age in years"
                  className="form-group"
                />
              </div>
              
              <FormField
                label="Medical Condition/Reason (Optional)"
                name="medicalCondition"
                value={formData.medicalCondition}
                onChange={handleFormChange}
                onBlur={handleFormBlur}
                error={formErrors.medicalCondition}
                placeholder="Brief description of medical condition requiring blood transfusion"
                multiline
                rows={3}
              />
            </div>

            <div className="form-section">
              <h4>Blood Request Details</h4>
              <div className="form-row">
                <FormField
                  label="Blood Group Required"
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
                  max="20"
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
                  label="Hospital/Department"
                  name="hospital"
                  value={formData.hospital}
                  onChange={handleFormChange}
                  onBlur={handleFormBlur}
                  error={formErrors.hospital}
                  required
                  placeholder="Hospital name and department"
                  className="form-group"
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <Loader /> : 'Submit Patient Request'}
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

      {debugMode && <HospitalDataDebug />}
      
      <div className="content-section">
        {activeView === 'requests' && (
          <div className="requests-view">
            <div className="section-title">
              <h3>Patient Blood Requests</h3>
              <span className="request-count">{hospitalRequests.length} requests</span>
            </div>

            {requestsLoading ? (
              <div className="requests-grid">
                {[...Array(3)].map((_, index) => (
                  <RequestCardSkeleton key={index} />
                ))}
              </div>
            ) : hospitalRequests.length === 0 ? (
              <div className="no-requests">
                <div className="no-requests-icon">🏥</div>
                <h4>No Patient Blood Requests</h4>
                <p>No patient blood requests have been submitted yet.</p>
                <div className="empty-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowCreateForm(true)}
                  >
                    Submit First Request
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={loadHospitalData}
                  >
                    Refresh
                  </button>
                </div>
              </div>
            ) : (
              <div className="requests-grid">
                {hospitalRequests.map(request => (
                  <PatientRequestCard 
                    key={request._id}
                    request={request}
                    getUrgencyColor={getUrgencyColor}
                    getStatusColor={getStatusColor}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeView === 'availability' && (
          <div className="availability-view">
            <div className="section-title">
              <h3>Blood Stock Availability</h3>
              <span className="stock-count">{bloodStock.length} stock entries</span>
            </div>

            {stockLoading ? (
              <div className="loading-section">
                <Loader />
                <p>Loading blood stock data...</p>
              </div>
            ) : (
              <div className="blood-groups-grid">
                {bloodGroups.map(group => {
                  const stockItems = getBloodStockByGroup(group.value);
                  const totalUnits = stockItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
                  
                  return (
                    <div key={group.value} className="blood-group-card">
                      <div className="blood-group-header">
                        <span className={`blood-badge ${group.value.replace('+', 'pos').replace('-', 'neg')}`}>
                          {group.value}
                        </span>
                        <span className="units-count">{totalUnits} units</span>
                      </div>
                      <div className="availability-status">
                        <div className={`status-indicator ${totalUnits > 10 ? 'good' : totalUnits > 5 ? 'medium' : totalUnits > 0 ? 'low' : 'out'}`}>
                          {totalUnits > 10 ? '✅ Good Stock' : 
                           totalUnits > 5 ? '⚠️ Medium Stock' : 
                           totalUnits > 0 ? '🔴 Low Stock' : '❌ Out of Stock'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {!stockLoading && bloodStock.length === 0 && (
              <div className="no-stock">
                <div className="no-stock-icon">🩸</div>
                <h4>No Blood Stock Data</h4>
                <p>Blood stock information is not available at the moment.</p>
              </div>
            )}
          </div>
        )}

        {activeView === 'donors' && (
          <div className="donors-view">
            <div className="section-title">
              <h3>Available Donors</h3>
              <span className="donor-count">{availableDonors.length} available</span>
            </div>

            {donorsLoading ? (
              <div className="loading-section">
                <Loader />
                <p>Loading available donors...</p>
              </div>
            ) : (
              <>
                <div className="donors-filter">
                  <select 
                    value={donorFilter} 
                    onChange={(e) => setDonorFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All Blood Groups</option>
                    {bloodGroups.map(group => (
                      <option key={group.value} value={group.value}>{group.value}</option>
                    ))}
                  </select>
                </div>
                
                {(() => {
                  const filteredDonors = donorFilter 
                    ? availableDonors.filter(donor => donor.bloodGroup === donorFilter)
                    : availableDonors;
                  
                  return filteredDonors.length === 0 ? (
                    <div className="no-donors">
                      <div className="no-donors-icon">👥</div>
                      <h4>{donorFilter ? `No ${donorFilter} Donors Available` : 'No Available Donors'}</h4>
                      <p>{donorFilter ? `No donors with ${donorFilter} blood group are currently available.` : 'No donors are currently available for blood donation.'}</p>
                    </div>
                  ) : (
                    <div className="donors-grid">
                      {filteredDonors.map(donor => (
                        <div key={donor._id} className="donor-card">
                          <div className="donor-header">
                            <h4>{donor.name}</h4>
                            <span className={`blood-badge ${donor.bloodGroup.replace('+', 'pos').replace('-', 'neg')}`}>
                              {donor.bloodGroup}
                            </span>
                          </div>
                          <div className="donor-info">
                            <div className="info-row">
                              <span className="info-label">City:</span>
                              <span className="info-value">{donor.city}</span>
                            </div>
                            <div className="info-row">
                              <span className="info-label">Age:</span>
                              <span className="info-value">{donor.age} years</span>
                            </div>
                            <div className="info-row">
                              <span className="info-label">Contact:</span>
                              <span className="info-value">{donor.phone}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalRequests;