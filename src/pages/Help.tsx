import React, { useState } from 'react';
import { Phone, MessageCircle, Wrench, Star, MapPin, Clock, ChevronRight } from 'lucide-react';
import './Help.css';

const Help: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('roadside');
  
  const [emergencyContacts] = useState([
    { id: 1, name: 'Roadside Assistance', number: '1800-xxx-xxxx', available: true },
    { id: 2, name: 'Police Emergency', number: '100', available: true },
    { id: 3, name: 'Medical Emergency', number: '108', available: true },
    { id: 4, name: 'Fire Emergency', number: '101', available: true },
  ]);

  const [roadsideServices] = useState([
    {
      id: 1,
      name: 'Quick Fix Garage',
      specialty: 'All Bike Repairs',
      rating: 4.8,
      distance: '2.1 km',
      responseTime: '15-20 min',
      phone: '+91 9876543210',
      services: ['Puncture', 'Battery', 'Engine', 'Brake'],
    },
    {
      id: 2,
      name: 'Speedy Mechanics',
      specialty: 'Emergency Repairs',
      rating: 4.6,
      distance: '3.5 km',
      responseTime: '20-25 min',
      phone: '+91 9876543211',
      services: ['Towing', 'Fuel', 'Jumpstart', 'Tire'],
    },
    {
      id: 3,
      name: 'Royal Service Center',
      specialty: 'Premium Service',
      rating: 4.9,
      distance: '1.8 km',
      responseTime: '10-15 min',
      phone: '+91 9876543212',
      services: ['All Repairs', 'Pickup', 'Delivery', 'Warranty'],
    },
  ]);

  const handleCall = (name: string, number: string) => {
    if (confirm(`Call ${name} at ${number}?`)) {
      window.open(`tel:${number}`);
    }
  };

  const handleRequestService = (service: any) => {
    if (confirm(`Request help from ${service.name}?\n\nThey will contact you within ${service.responseTime}.`)) {
      console.log(`Requesting service from ${service.name}`);
    }
  };

  const CategoryButton = ({ title, type, icon: Icon, count }: any) => (
    <button
      className={`category-button ${activeCategory === type ? 'active' : ''}`}
      onClick={() => setActiveCategory(type)}
    >
      <Icon size={20} />
      <span>{title}</span>
      {count && <div className="category-badge">{count}</div>}
    </button>
  );

  const EmergencyContactCard = ({ contact }: any) => (
    <div className="emergency-card" onClick={() => handleCall(contact.name, contact.number)}>
      <div className="emergency-icon">
        <Phone size={20} color="#E53935" />
      </div>
      <div className="emergency-info">
        <h3 className="emergency-name">{contact.name}</h3>
        <p className="emergency-number">{contact.number}</p>
      </div>
      <div className={`availability-badge ${contact.available ? 'available' : 'busy'}`}>
        <span>{contact.available ? 'Available' : 'Busy'}</span>
      </div>
    </div>
  );

  const ServiceCard = ({ service }: any) => (
    <div className="service-card">
      <div className="service-header">
        <div className="service-icon-container">
          <Wrench size={24} color="#2196F3" />
        </div>
        <div className="service-main-info">
          <h3 className="service-name">{service.name}</h3>
          <p className="service-specialty">{service.specialty}</p>
          <div className="service-metrics">
            <div className="service-metric">
              <Star size={12} color="#FFCA28" />
              <span>{service.rating}</span>
            </div>
            <div className="service-metric">
              <MapPin size={12} color="#B0BEC5" />
              <span>{service.distance}</span>
            </div>
            <div className="service-metric">
              <Clock size={12} color="#B0BEC5" />
              <span>{service.responseTime}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="service-services">
        {service.services.map((serviceType: string, index: number) => (
          <div key={index} className="service-tag">
            <span>{serviceType}</span>
          </div>
        ))}
      </div>

      <div className="service-actions">
        <button 
          className="call-service-button"
          onClick={() => handleCall(service.name, service.phone)}
        >
          <Phone size={16} color="#4CAF50" />
          <span>Call</span>
        </button>
        <button 
          className="request-service-button"
          onClick={() => handleRequestService(service)}
        >
          <span>Request Service</span>
          <ChevronRight size={16} color="#FFFFFF" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="help-container">
      <div className="help-gradient">
        {/* Header */}
        <div className="header">
          <h1 className="title">Knight Support</h1>
          <p className="subtitle">We've got your back</p>
        </div>

        {/* Categories */}
        <div className="categories-container">
          <div className="categories">
            <CategoryButton title="Emergency" type="emergency" icon={Phone} count={4} />
            <CategoryButton title="Roadside" type="roadside" icon={Wrench} count={3} />
            <CategoryButton title="Chat" type="chat" icon={MessageCircle} />
          </div>
        </div>

        {/* Content */}
        <div className="content">
          {activeCategory === 'emergency' && (
            <div className="emergency-section">
              <h2 className="section-title">Emergency Contacts</h2>
              <p className="section-subtitle">Tap to call immediately</p>
              {emergencyContacts.map(contact => (
                <EmergencyContactCard key={contact.id} contact={contact} />
              ))}
            </div>
          )}

          {activeCategory === 'roadside' && (
            <div className="roadside-section">
              <h2 className="section-title">Roadside Assistance</h2>
              <p className="section-subtitle">Professional help near you</p>
              {roadsideServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}

          {activeCategory === 'chat' && (
            <div className="chat-section">
              <h2 className="section-title">Chat Support</h2>
              <p className="section-subtitle">Get help through chat</p>
              
              <div className="chat-card">
                <div className="chat-icon">
                  <MessageCircle size={24} color="#2196F3" />
                </div>
                <div className="chat-info">
                  <h3 className="chat-title">Live Chat Support</h3>
                  <p className="chat-description">
                    Connect with our support team for assistance with your ride
                  </p>
                </div>
                <button className="start-chat-button">
                  <span>Start Chat</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Help;