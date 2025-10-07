import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, MapPin, Users, Clock, Shield, Siren, Navigation } from 'lucide-react';
import './SOS.css';

const SOS: React.FC = () => {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [emergencyContacts] = useState([
    { id: 1, name: 'Emergency Contact 1', phone: '+91 9876543210', relation: 'Family' },
    { id: 2, name: 'Emergency Contact 2', phone: '+91 9876543211', relation: 'Friend' },
    { id: 3, name: 'Roadside Assistance', phone: '1800-xxx-xxxx', relation: 'Service' },
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isEmergencyActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0 && isEmergencyActive) {
      triggerEmergency();
    }
    return () => clearInterval(interval);
  }, [isEmergencyActive, countdown]);

  const startEmergency = () => {
    if (confirm('This will send your location to emergency contacts and call for help. Are you sure?')) {
      setIsEmergencyActive(true);
      setCountdown(10);
    }
  };

  const cancelEmergency = () => {
    setIsEmergencyActive(false);
    setCountdown(0);
  };

  const triggerEmergency = () => {
    alert('Emergency Triggered!\n\nYour location has been shared with emergency contacts and help is on the way.');
    setIsEmergencyActive(false);
  };

  const EmergencyContactCard = ({ contact }: any) => (
    <div className="contact-card">
      <div className="contact-icon">
        <Users size={20} color="#E53935" />
      </div>
      <div className="contact-info">
        <h3 className="contact-name">{contact.name}</h3>
        <p className="contact-relation">{contact.relation}</p>
        <p className="contact-phone">{contact.phone}</p>
      </div>
      <button className="call-button">
        <Phone size={16} color="#4CAF50" />
      </button>
    </div>
  );

  const QuickActionButton = ({ icon: Icon, title, subtitle, onClick, color }: any) => (
    <div className="quick-action-button" onClick={onClick}>
      <div className="quick-action-icon" style={{ backgroundColor: color }}>
        <Icon size={24} color="#FFFFFF" />
      </div>
      <h3 className="quick-action-title">{title}</h3>
      <p className="quick-action-subtitle">{subtitle}</p>
    </div>
  );

  return (
    <div className="sos-container">
      <div className="sos-gradient">
        {/* Header */}
        <div className="header">
          <h1 className="title">Knight Guard</h1>
          <p className="subtitle">Your emergency shield</p>
        </div>

        {/* Emergency Status */}
        {isEmergencyActive && (
          <div className="emergency-status">
            <div className="emergency-gradient">
              <div className="emergency-content">
                <Siren size={32} color="#FFFFFF" />
                <h2 className="emergency-title">EMERGENCY ACTIVE</h2>
                <p className="emergency-countdown">
                  {countdown > 0 ? `Sending in ${countdown}s` : 'Sending help...'}
                </p>
                <button className="cancel-button" onClick={cancelEmergency}>
                  Cancel Emergency
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main SOS Button */}
        {!isEmergencyActive && (
          <div className="sos-button-container">
            <button className="sos-button" onClick={startEmergency}>
              <div className="sos-button-gradient">
                <AlertTriangle size={64} color="#FFFFFF" />
                <h2 className="sos-text">SOS</h2>
                <p className="sos-subtext">Hold for Emergency</p>
              </div>
            </button>
          </div>
        )}

        {/* Safety Features */}
        <div className="safety-features">
          <h2 className="section-title">Safety Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <Shield size={24} color="#4CAF50" />
              <h3 className="feature-title">Location Sharing</h3>
              <p className="feature-subtitle">Auto-share location</p>
            </div>
            <div className="feature-card">
              <Clock size={24} color="#FF9800" />
              <h3 className="feature-title">10s Delay</h3>
              <p className="feature-subtitle">Cancel if needed</p>
            </div>
            <div className="feature-card">
              <Phone size={24} color="#2196F3" />
              <h3 className="feature-title">Auto Call</h3>
              <p className="feature-subtitle">Call contacts</p>
            </div>
            <div className="feature-card">
              <Navigation size={24} color="#9C27B0" />
              <h3 className="feature-title">Live Tracking</h3>
              <p className="feature-subtitle">Real-time location</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            <QuickActionButton
              icon={Phone}
              title="Call Police"
              subtitle="100"
              color="#E53935"
            />
            <QuickActionButton
              icon={Phone}
              title="Medical"
              subtitle="108"
              color="#F44336"
            />
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="emergency-contacts">
          <h2 className="section-title">Emergency Contacts</h2>
          {emergencyContacts.map(contact => (
            <EmergencyContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SOS;