import { useState, useEffect } from 'react';
import { authService } from '../auth/authService';
import Loader from '../../components/Loader';
import './UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || ''
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      setTimeout(() => {
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setSuccess('Profile updated successfully!');
        setEditing(false);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setError('Failed to update profile');
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'var(--blood-red)';
      case 'hospital': return 'var(--medical-blue)';
      case 'donor': return 'var(--life-green)';
      default: return 'var(--gray-600)';
    }
  };

  if (!user) {
    return (
      <div className="user-profile">
        <div className="profile-error">
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
        <div className="profile-info">
          <h1>{user.name}</h1>
          <div className="role-badge" style={{ color: getRoleColor(user.role) }}>
            <span>{user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}</span>
          </div>
        </div>
        <div className="profile-actions">
          {!editing ? (
            <button 
              className="btn btn-primary"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          ) : (
            <button 
              className="btn btn-secondary"
              onClick={() => {
                setEditing(false);
                setFormData({
                  name: user.name || '',
                  email: user.email || ''
                });
                setError('');
                setSuccess('');
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="profile-content">
        {editing ? (
          <div className="profile-form-section">
            <h2>Edit Profile Information</h2>
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <Loader /> : 'Save Changes'}
              </button>
            </form>
          </div>
        ) : (
          <div className="profile-details">
            <div className="detail-section">
              <h2>Account Information</h2>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Full Name</label>
                  <span>{user.name}</span>
                </div>
                <div className="detail-item">
                  <label>Email Address</label>
                  <span>{user.email}</span>
                </div>
                <div className="detail-item">
                  <label>Account Type</label>
                  <span>{user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}</span>
                </div>
                <div className="detail-item">
                  <label>Member Since</label>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h2>Account Statistics</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--life-green)">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div className="stat-info">
                    <span className="stat-number">Active</span>
                    <span className="stat-label">Account Status</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--medical-blue)">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div className="stat-info">
                    <span className="stat-number">Verified</span>
                    <span className="stat-label">Email Status</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;