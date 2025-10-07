import React, { useState } from 'react';
import { User, Bell, Shield, MapPin, Phone, HelpCircle, ChevronRight, Plus, Edit3, Trash2, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Settings.css';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [autoCallEnabled, setAutoCallEnabled] = useState(true);
  
  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: 1, name: 'John Doe', phone: '+91 9876543210', relation: 'Family' },
    { id: 2, name: 'Jane Smith', phone: '+91 9876543211', relation: 'Friend' },
  ]);

  const SettingItem = ({ icon: Icon, title, subtitle, onClick, rightElement, color = '#B0BEC5' }: any) => (
    <div className="setting-item" onClick={onClick}>
      <div className="setting-icon">
        <Icon size={20} color={color} />
      </div>
      <div className="setting-content">
        <h3 className="setting-title">{title}</h3>
        {subtitle && <p className="setting-subtitle">{subtitle}</p>}
      </div>
      {rightElement || <ChevronRight size={20} color="#B0BEC5" />}
    </div>
  );

  const SwitchSettingItem = ({ icon: Icon, title, subtitle, value, onValueChange, color = '#B0BEC5' }: any) => (
    <div className="setting-item">
      <div className="setting-icon">
        <Icon size={20} color={color} />
      </div>
      <div className="setting-content">
        <h3 className="setting-title">{title}</h3>
        {subtitle && <p className="setting-subtitle">{subtitle}</p>}
      </div>
      <label className="switch">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onValueChange(e.target.checked)}
        />
        <span className="slider"></span>
      </label>
    </div>
  );

  const ContactCard = ({ contact, onEdit, onDelete }: any) => (
    <div className="contact-card">
      <div className="contact-info">
        <h3 className="contact-name">{contact.name}</h3>
        <p className="contact-phone">{contact.phone}</p>
        <p className="contact-relation">{contact.relation}</p>
      </div>
      <div className="contact-actions">
        <button className="contact-action edit" onClick={() => onEdit(contact)}>
          <Edit3 size={16} color="#2196F3" />
        </button>
        <button className="contact-action delete" onClick={() => onDelete(contact)}>
          <Trash2 size={16} color="#F44336" />
        </button>
      </div>
    </div>
  );

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-gradient">
        {/* Header */}
        <div className="header">
          <h1 className="title">Settings</h1>
          <p className="subtitle">Manage your preferences</p>
        </div>

        {/* Profile Section */}
        <div className="section">
          <h2 className="section-title">Profile</h2>
          <div className="profile-card">
            <div className="profile-avatar">
              <User size={32} color="#FFFFFF" />
            </div>
            <div className="profile-info">
              <h3 className="profile-name">{user?.name || 'Knight Rider'}</h3>
              <p className="profile-phone">{user?.phone || '+91 9876543200'}</p>
              <p className="profile-email">{user?.email || 'knight@example.com'}</p>
            </div>
            <button className="edit-button">
              <Edit3 size={20} color="#E53935" />
            </button>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="section">
          <h2 className="section-title">Vehicle Information</h2>
          <SettingItem
            icon={SettingsIcon}
            title="Bike Model"
            subtitle={user?.bike_model || 'Royal Enfield Classic 350'}
            color="#FF9800"
          />
          <SettingItem
            icon={SettingsIcon}
            title="License Number"
            subtitle="MH02-XX-1234"
            color="#FF9800"
          />
        </div>

        {/* Safety Settings */}
        <div className="section">
          <h2 className="section-title">Safety Settings</h2>
          <SwitchSettingItem
            icon={Bell}
            title="Push Notifications"
            subtitle="Receive alerts and updates"
            value={notifications}
            onValueChange={setNotifications}
            color="#4CAF50"
          />
          <SwitchSettingItem
            icon={MapPin}
            title="Location Sharing"
            subtitle="Share location with emergency contacts"
            value={locationSharing}
            onValueChange={setLocationSharing}
            color="#2196F3"
          />
          <SwitchSettingItem
            icon={Phone}
            title="Auto Call"
            subtitle="Automatically call in emergency"
            value={autoCallEnabled}
            onValueChange={setAutoCallEnabled}
            color="#E53935"
          />
          <SwitchSettingItem
            icon={Shield}
            title="Emergency Mode"
            subtitle="Enhanced safety features"
            value={emergencyMode}
            onValueChange={setEmergencyMode}
            color="#F44336"
          />
        </div>

        {/* Emergency Contacts */}
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Emergency Contacts</h2>
            <button className="add-button">
              <Plus size={20} color="#E53935" />
            </button>
          </div>
          {emergencyContacts.map(contact => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onEdit={(contact: any) => console.log('Edit contact:', contact)}
              onDelete={(contact: any) => console.log('Delete contact:', contact)}
            />
          ))}
        </div>

        {/* General Settings */}
        <div className="section">
          <h2 className="section-title">General</h2>
          <SettingItem
            icon={HelpCircle}
            title="Help & Support"
            subtitle="Get help and contact support"
            color="#9C27B0"
          />
          <SettingItem
            icon={Shield}
            title="Privacy Policy"
            subtitle="Read our privacy policy"
            color="#9C27B0"
          />
          <SettingItem
            icon={SettingsIcon}
            title="Terms of Service"
            subtitle="View terms and conditions"
            color="#9C27B0"
          />
          <SettingItem
            icon={LogOut}
            title="Logout"
            subtitle="Sign out of your account"
            onClick={handleLogout}
            color="#F44336"
            rightElement={null}
          />
        </div>

        {/* App Information */}
        <div className="app-info">
          <p className="app-info-text">Knight Ride v1.0.0</p>
          <p className="app-info-subtext">Your trusted riding companion</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;