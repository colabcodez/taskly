import React from 'react';
import { API_ENDPOINTS } from '../../config/api';

const ApiDebug = () => {
  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: '#f0f0f0',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4>API Debug Info</h4>
      <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
      <p><strong>API Base URL:</strong> {process.env.REACT_APP_API_URL || 'Using default'}</p>
      <p><strong>Register Endpoint:</strong> {API_ENDPOINTS.AUTH.REGISTER}</p>
      <p><strong>Signin Endpoint:</strong> {API_ENDPOINTS.AUTH.SIGNIN}</p>
    </div>
  );
};

export default ApiDebug;
