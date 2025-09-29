import React, { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const ApiDebug = () => {
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }

  const testApiConnection = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_ENDPOINTS.AUTH.REGISTER.replace('/register', '/test'));
      setTestResult({ success: true, data: response.data });
    } catch (error) {
      setTestResult({ 
        success: false, 
        error: error.message,
        details: error.response?.data || error.response?.status
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      
      <button 
        onClick={testApiConnection} 
        disabled={isLoading}
        style={{ marginTop: '10px', padding: '5px 10px' }}
      >
        {isLoading ? 'Testing...' : 'Test API Connection'}
      </button>
      
      {testResult && (
        <div style={{ marginTop: '10px', fontSize: '10px' }}>
          {testResult.success ? (
            <div style={{ color: 'green' }}>
              <strong>Success:</strong> {JSON.stringify(testResult.data)}
            </div>
          ) : (
            <div style={{ color: 'red' }}>
              <strong>Error:</strong> {testResult.error}
              {testResult.details && <div>Details: {JSON.stringify(testResult.details)}</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiDebug;
