import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authActions } from "../../store";
import {
  FiCheckSquare,
  FiHome,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

const Navbar = () => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const logout = () => {
    sessionStorage.clear();
    dispatch(authActions.logout());
    navigate("/signin");
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Home", icon: <FiHome />, requireAuth: false, hideWhenLoggedIn: true },
    { path: "/todo", label: "Dashboard", icon: <FiCheckSquare />, requireAuth: true },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="navbar-brand" onClick={() => setIsMenuOpen(false)}>
            <FiCheckSquare className="brand-icon" />
            <span className="brand-text">Taskly</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-nav-desktop">
            {navItems.map((item) => {
              if (item.requireAuth && !isLoggedIn) return null;
              if (item.hideWhenLoggedIn && isLoggedIn) return null;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="navbar-actions">
            {/* Auth Buttons */}
            {!isLoggedIn ? (
              <div className="auth-buttons">
                <Link to="/signin" className="btn btn-ghost btn-sm">
                  Log in
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm">
                  Start for free
                </Link>
              </div>
            ) : (
              <div className="user-menu">
                <div className="user-info">
                  <FiUser className="user-icon" />
                  <span className="user-name">User</span>
                </div>
                <button
                  className="logout-btn"
                  onClick={logout}
                  aria-label="Logout"
                >
                  <FiLogOut />
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">
            {navItems.map((item) => {
              if (item.requireAuth && !isLoggedIn) return null;
              if (item.hideWhenLoggedIn && isLoggedIn) return null;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {!isLoggedIn && (
              <div className="mobile-auth-buttons">
                <Link
                  to="/signin"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Start for free
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;