import React, { useState } from "react";
import "./signup.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../../store";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiMail, FiLock, FiArrowRight, FiCheckSquare } from "react-icons/fi";

const SignIn = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const [Inputs, setInputs] = useState({
    email: "",
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

    if (!Inputs.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      console.log("Attempting sign in with:", Inputs);
      const response = await axios.post(
        `http://localhost:1000/api/v1/signin`,
        Inputs
      );

      console.log("Sign in response:", response.data);

      if (response.data && response.data.user) {
        sessionStorage.setItem("id", response.data.user._id);
        dispatch(authActions.login());
        toast.success("Signed in successfully!");
        history("/todo");
      } else {
        console.error("Invalid response structure:", response.data);
        toast.error("Invalid response from server");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Sign in failed. Please try again.");
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
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-description">
              Sign in to continue managing your tasks.
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
                  value={Inputs.email}
                  onChange={change}
                  disabled={isLoading}
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-form">
                <FiLock className="input-icon" />
                <input
                  className={`auth-input ${errors.password ? 'error' : ''}`}
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={Inputs.password}
                  onChange={change}
                  disabled={isLoading}
                />
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="flex-row">
              <div>
                <label className="form-label">
                  <input type="checkbox" />
                  Remember me
                </label>
              </div>
              <div>
                <span className="span">Forgot password?</span>
              </div>
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
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <FiArrowRight className="button-icon" />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p className="p">
              Don't have an account?{" "}
              <Link to="/signup" className="span">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;