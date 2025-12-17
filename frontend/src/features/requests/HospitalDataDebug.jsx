import { useState, useEffect } from 'react';
import { bloodService } from '../blood/bloodService';
import { donorService } from '../donor/donorService';
import { authService } from '../auth/authService';

const HospitalDataDebug = () => {
  const [debugInfo, setDebugInfo] = useState({
    user: null,
    requests: [],
    donors: [],
    stock: [],
    errors: []
  });

  useEffect(() => {
    const loadDebugData = async () => {
      const user = authService.getCurrentUser();
      const errors = [];
      let requests = [];
      let donors = [];
      let stock = [];

      try {
        const requestsRes = await bloodService.getBloodRequests();
        requests = requestsRes?.success ? requestsRes.data : (Array.isArray(requestsRes) ? requestsRes : []);
      } catch (error) {
        errors.push(`Requests API: ${error.message}`);
      }

      try {
        const donorsRes = await donorService.getDonors();
        donors = donorsRes?.success ? donorsRes.data : (Array.isArray(donorsRes) ? donorsRes : []);
      } catch (error) {
        errors.push(`Donors API: ${error.message}`);
      }

      try {
        const stockRes = await bloodService.getBloodStock();
        stock = stockRes?.success ? stockRes.data : (Array.isArray(stockRes) ? stockRes : []);
      } catch (error) {
        errors.push(`Stock API: ${error.message}`);
      }

      setDebugInfo({ user, requests, donors, stock, errors });
    };

    loadDebugData();
  }, []);

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', margin: '20px', borderRadius: '8px' }}>
      <h3>Hospital Data Debug Info</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4>Current User:</h4>
        <pre>{JSON.stringify(debugInfo.user, null, 2)}</pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Requests ({debugInfo.requests.length}):</h4>
        <pre>{JSON.stringify(debugInfo.requests.slice(0, 2), null, 2)}</pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Donors ({debugInfo.donors.length}):</h4>
        <pre>{JSON.stringify(debugInfo.donors.slice(0, 2), null, 2)}</pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Stock ({debugInfo.stock.length}):</h4>
        <pre>{JSON.stringify(debugInfo.stock.slice(0, 2), null, 2)}</pre>
      </div>

      {debugInfo.errors.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4>Errors:</h4>
          <ul>
            {debugInfo.errors.map((error, index) => (
              <li key={index} style={{ color: 'red' }}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HospitalDataDebug;