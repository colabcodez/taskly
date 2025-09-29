import React, { useState } from "react";
import "./signup.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiUser, FiMail, FiLock, FiArrowRight, FiCheckSquare } from "react-icons/fi";
import { API_ENDPOINTS } from "../../config/api";

const Signup = () => {
  const history = useNavigate();
  const [Inputs, setInputs] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const change = (e) => {
    const { name, value } = e.target;
    setInputs({ ...Inputs, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!Inputs.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(Inputs.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!Inputs.username.trim()) {
      newErrors.username = "Username is required";
    } else if (Inputs.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!Inputs.password.trim()) {
      newErrors.password = "Password is required";
    } else if (Inputs.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const testApiConnection = async () => {
    try {
      console.log("Testing API connection...");
      console.log("Testing URL:", API_ENDPOINTS.AUTH.REGISTER.replace('/register', '/test'));
      const response = await axios.get(API_ENDPOINTS.AUTH.REGISTER.replace('/register', '/test'));
      console.log("API test response:", response);
      toast.success("API connection successful!");
    } catch (error) {
      console.log("API test error:", error);
      toast.error(`API test failed: ${error.message}`);
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      console.log("=== SIGNUP DEBUG INFO ===");
      console.log("Attempting signup with:", Inputs);
      console.log("API endpoint:", API_ENDPOINTS.AUTH.REGISTER);
      console.log("Environment:", process.env.NODE_ENV);
      console.log("API Base URL:", process.env.REACT_APP_API_URL);
      
      const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER, Inputs);
      console.log("Signup response:", response.data);

      if (response.data.message === "User Already Exists") {
        toast.error(response.data.message);
      } else {
        toast.success(response.data.message);
        setInputs({
          email: "",
          username: "",
          password: "",
        });
        history("/signin");
      }
    } catch (error) {
      console.error("=== SIGNUP ERROR DEBUG ===");
      console.error("Full error object:", error);
      console.error("Error message:", error.message);
      console.error("Error code:", error.code);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error headers:", error.response?.headers);
      console.error("Request URL:", error.config?.url);
      console.error("Request method:", error.config?.method);
      
      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        toast.error("Network error: Please check your internet connection and try again.");
      } else if (error.response?.status === 404) {
        toast.error("API endpoint not found. Please contact support.");
      } else if (error.response?.status >= 500) {
        toast.error("Server error. Please try again later.");
      } else if (error.code === 'ECONNREFUSED') {
        toast.error("Cannot connect to server. Please check if the backend is running.");
      } else if (error.message.includes('CORS')) {
        toast.error("CORS error: Please check server configuration.");
      } else {
        toast.error(error.response?.data?.message || "Signup failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <FiCheckSquare className="logo-icon" />
              <span className="logo-text">Taskly</span>
            </div>
            <h2 className="auth-title">Create your account</h2>
            <p className="auth-description">
              Join millions of users who trust our app to manage their tasks.
            </p>
          </div>

          <form className="auth-form" onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-form">
                <FiMail className="input-icon" />
                <input
                  className={`auth-input ${errors.email ? 'error' : ''}`}
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  onChange={change}
                  value={Inputs.email}
                  disabled={isLoading}
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="input-form">
                <FiUser className="input-icon" />
                <input
                  className={`auth-input ${errors.username ? 'error' : ''}`}
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  onChange={change}
                  value={Inputs.username}
                  disabled={isLoading}
                />
              </div>
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-form">
                <FiLock className="input-icon" />
                <input
                  className={`auth-input ${errors.password ? 'error' : ''}`}
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  onChange={change}
                  value={Inputs.password}
                  disabled={isLoading}
                />
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <button
              className="button-submit"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <FiArrowRight className="button-icon" />
                </>
              )}
            </button>
            
            {/* Debug button - remove in production */}
            {process.env.NODE_ENV === 'development' && (
              <button
                type="button"
                onClick={testApiConnection}
                style={{
                  marginTop: '10px',
                  padding: '5px 10px',
                  fontSize: '12px',
                  background: '#f0f0f0',
                  border: '1px solid #ccc',
                  borderRadius: '3px'
                }}
              >
                Test API Connection
              </button>
            )}
          </form>

          <div className="auth-footer">
            <p className="p">
              Already have an account?{" "}
              <Link to="/signin" className="span">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;