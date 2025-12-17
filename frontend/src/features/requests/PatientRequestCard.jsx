import './PatientRequestCard.css';

const PatientRequestCard = ({ request, getUrgencyColor, getStatusColor }) => {
  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case 'low': return '🟢';
      case 'medium': return '🟡';
      case 'high': return '🔴';
      case 'critical': return '🆘';
      default: return '🟠';
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
  return (
    <div className="patient-request-card">
      <div className="request-header">
        <div className="request-badges">
          <span className={`blood-badge ${request.bloodGroup.replace('+', 'pos').replace('-', 'neg')}`}>
            🩸 {request.bloodGroup}
          </span>
          <span 
            className="urgency-badge"
            style={{ backgroundColor: getUrgencyColor(request.urgency) }}
          >
            {getUrgencyIcon(request.urgency)} {request.urgency}
          </span>
        </div>
        <span 
          className="status-badge"
          style={{ backgroundColor: getStatusColor(request.status) }}
        >
          {getStatusIcon(request.status)} {request.status}
        </span>
      </div>
      
      <div className="request-details">
        <h4>🧑‍⚕️ {request.patientName}</h4>
        {request.patientAge && (
          <div className="detail-row">
            <span className="detail-label">Age:</span>
            <span className="detail-value">{request.patientAge} years</span>
          </div>
        )}
        <div className="detail-row">
          <span className="detail-label">Hospital:</span>
          <span className="detail-value">{request.hospital}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Quantity:</span>
          <span className="detail-value">{request.quantity} units</span>
        </div>
        {request.contactNumber && (
          <div className="detail-row">
            <span className="detail-label">Contact:</span>
            <span className="detail-value">{request.contactNumber}</span>
          </div>
        )}
        <div className="detail-row">
          <span className="detail-label">Submitted:</span>
          <span className="detail-value">{new Date(request.requestDate).toLocaleDateString()}</span>
        </div>
        {request.medicalCondition && (
          <div className="detail-row medical-condition">
            <span className="detail-label">Condition:</span>
            <span className="detail-value">{request.medicalCondition}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientRequestCard;