import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../auth/authService';
import { bloodService } from '../blood/bloodService';
import { donorService } from '../donor/donorService';
import AddDonor from '../donor/AddDonor';
import DonorList from '../donor/DonorList';
import BloodStock from '../blood/BloodStock';
import BloodRequests from '../requests/BloodRequests';
import UserBloodRequest from '../requests/UserBloodRequest';
import HospitalRequests from '../requests/HospitalRequests';
import UserProfile from '../profile/UserProfile';
import Analytics from '../analytics/Analytics';
import Loader from '../../components/Loader';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ donors: 0, bloodStock: 0, requests: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [donorsRes, stockRes, requestsRes] = await Promise.all([
        donorService.getDonors().catch((err) => {
          console.log('Donors API error:', err.response?.status);
          return { data: [] };
        }),
        bloodService.getBloodStock().catch((err) => {
          console.log('Blood stock API error:', err.response?.status);
          return { data: [] };
        }),
        bloodService.getBloodRequests().catch((err) => {
          console.log('Requests API error:', err.response?.status);
          return { data: [] };
        })
      ]);
      
      const donorCount = donorsRes?.success ? donorsRes.data?.length || 0 : (Array.isArray(donorsRes) ? donorsRes.length : 0);
      const stockCount = stockRes?.success ? stockRes.data?.length || 0 : (Array.isArray(stockRes) ? stockRes.length : 0);
      const requestCount = requestsRes?.success ? requestsRes.data?.length || 0 : (Array.isArray(requestsRes) ? requestsRes.length : 0);
      
      setStats({
        donors: donorCount,
        bloodStock: stockCount,
        requests: requestCount
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Loader />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div className="header-content">
            <div className="welcome-section">
              <h1 className="welcome-title">
                <span className="welcome-text">Welcome back,</span>
                <span className="user-name">{user?.name}</span>
                <span className="wave-emoji">👋</span>
              </h1>
              <div className="role-badge">
                <span className="role-icon">
                  {user?.role === 'admin' ? '👨‍⚕️' : user?.role === 'hospital' ? '🏥' : '🩸'}
                </span>
                <span className="role-text">{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}</span>
              </div>
            </div>
            <div className="header-decoration">
              <div className="floating-icon blood-drop">🩸</div>
              <div className="floating-icon heart">❤️</div>
              <div className="floating-icon medical">⚕️</div>
            </div>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'donors' ? 'active' : ''}`}
            onClick={() => setActiveTab('donors')}
          >
            Donors
          </button>
          <button 
            className={`tab ${activeTab === 'blood' ? 'active' : ''}`}
            onClick={() => setActiveTab('blood')}
          >
            Blood Stock
          </button>
          {user?.role === 'admin' && (
            <button 
              className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </button>
          )}
          {user?.role === 'donor' && (
            <button 
              className={`tab ${activeTab === 'my-requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('my-requests')}
            >
              My Requests
            </button>
          )}
          {user?.role === 'hospital' && (
            <button 
              className={`tab ${activeTab === 'hospital-requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('hospital-requests')}
            >
              Patient Requests
            </button>
          )}
          {user?.role === 'admin' && (
            <button 
              className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              Manage All Requests
            </button>
          )}
          <button 
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <div className="overview">
              <div className="stats-grid">
                <div className="stat-card donors-card">
                  <div className="stat-icon donors">
                    <div className="icon-bg">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 7H16c-.8 0-1.54.37-2 1l-3.72 5.6L8.5 11.5C7.67 10.67 6.83 10 6 10s-1.67.67-2.5 1.5L2 13v7h2v-5.5l1.5-1.5L7 15.5V22h2v-7l2.72-2.72L14.5 16H18v6h2z"/>
                      </svg>
                    </div>
                    <div className="pulse-ring donors-pulse"></div>
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{stats.donors}</h3>
                    <p className="stat-label">Total Donors</p>
                    <div className="stat-trend positive">↗ +12% this month</div>
                  </div>
                </div>
                
                <div className="stat-card blood-card">
                  <div className="stat-icon blood">
                    <div className="icon-bg">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                    <div className="pulse-ring blood-pulse"></div>
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{stats.bloodStock}</h3>
                    <p className="stat-label">Blood Units</p>
                    <div className="stat-trend neutral">→ Stable stock</div>
                  </div>
                </div>
                
                <div className="stat-card requests-card">
                  <div className="stat-icon requests">
                    <div className="icon-bg">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                      </svg>
                    </div>
                    <div className="pulse-ring requests-pulse"></div>
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{stats.requests}</h3>
                    <p className="stat-label">Active Requests</p>
                    <div className="stat-trend urgent">⚡ 3 urgent</div>
                  </div>
                </div>
              </div>
              
              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="actions-grid">
                  <button 
                    className="action-btn"
                    onClick={() => setActiveTab('donors')}
                  >
                    Add New Donor
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => navigate('/find-donors')}
                  >
                    Find Donors
                  </button>
                  {user?.role === 'admin' && (
                    <button 
                      className="action-btn"
                      onClick={() => setActiveTab('blood')}
                    >
                      Manage Blood Stock
                    </button>
                  )}
                  {user?.role === 'donor' && (
                    <button 
                      className="action-btn"
                      onClick={() => setActiveTab('my-requests')}
                    >
                      Request Blood
                    </button>
                  )}
                  {user?.role === 'hospital' && (
                    <button 
                      className="action-btn"
                      onClick={() => setActiveTab('hospital-requests')}
                    >
                      Patient Requests
                    </button>
                  )}
                  {user?.role === 'admin' && (
                    <button 
                      className="action-btn"
                      onClick={() => setActiveTab('requests')}
                    >
                      Manage All Requests
                    </button>
                  )}
                  {user?.role === 'admin' && (
                    <button 
                      className="action-btn"
                      onClick={() => setActiveTab('analytics')}
                    >
                      View Analytics
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'donors' && (
            <div className="donors-section">
              <AddDonor onDonorAdded={loadDashboardData} />
              <DonorList key={stats.donors} />
            </div>
          )}

          {activeTab === 'blood' && (
            <BloodStock userRole={user?.role} onStockUpdated={loadDashboardData} />
          )}

          {activeTab === 'my-requests' && user?.role === 'donor' && (
            <UserBloodRequest />
          )}

          {activeTab === 'hospital-requests' && user?.role === 'hospital' && (
            <HospitalRequests />
          )}

          {activeTab === 'requests' && user?.role === 'admin' && (
            <BloodRequests userRole={user?.role} onRequestUpdated={loadDashboardData} />
          )}

          {activeTab === 'profile' && (
            <UserProfile />
          )}

          {activeTab === 'analytics' && user?.role === 'admin' && (
            <Analytics />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;