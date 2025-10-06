import React from "react";
import "./home.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FiCheckSquare,
  FiArrowRight,
  FiTrendingUp,
  FiShield,
  FiTarget,
  FiCalendar,
  FiUser,
  FiFlag,
  FiMoreHorizontal,
} from "react-icons/fi";

const Home = () => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-subtitle">Clear your mind</div>
              <h1 className="hero-title">
                Capture tasks at the speed of thought
              </h1>

              <p className="hero-description">
                We've spent over a decade refining Taskly to be an extension of your mind. Capture and organize tasks instantly using easy-flowing, natural language.
              </p>

              <div className="hero-actions">
                {isLoggedIn ? (
                  <Link to="/todo" className="cssbuttons-io-button">
                    <span>Go to Dashboard</span>
                    <div className="icon">
                      <FiArrowRight />
                    </div>
                  </Link>
                ) : (
                  <>
                    <Link to="/signup" className="cssbuttons-io-button">
                      <span>Start for free</span>
                      <div className="icon">
                        <FiArrowRight />
                      </div>
                    </Link>
                    <Link to="/signin" className="btn btn-ghost btn-lg">
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-demo-container">
                <div className="hero-card">
                  <div className="card-header">
                    <div className="card-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="task-input-container">
                      <input 
                        type="text" 
                        className="task-input" 
                        placeholder="Review website traffic"
                        defaultValue="Review website traffic"
                      />
                      <div className="task-tags">
                        <div className="tag">
                          <FiCalendar className="tag-icon" />
                          <span>Due date</span>
                          <span className="tag-close">×</span>
                        </div>
                        <div className="tag">
                          <FiUser className="tag-icon" />
                          <span>Assignee</span>
                          <span className="tag-close">×</span>
                        </div>
                        <div className="tag">
                          <FiFlag className="tag-icon" />
                          <span>Priority</span>
                          <span className="tag-close">×</span>
                        </div>
                        <div className="tag-more">
                          <FiMoreHorizontal />
                        </div>
                      </div>
                      <div className="task-footer">
                        <div className="inbox-selector">
                          <FiCheckSquare className="inbox-icon" />
                          <span>Inbox</span>
                          <FiArrowRight className="dropdown-icon" />
                        </div>
                        <button className="add-task-btn">
                          Add task
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Simplify your workflow</h2>
          <p className="section-description">
            Everything you need to get organized and stay on track.
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FiTarget />
              </div>
              <h3 className="feature-title">Set Clear Goals</h3>
              <p className="feature-description">Define your objectives and break them into actionable tasks.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FiCheckSquare />
              </div>
              <h3 className="feature-title">Track Progress</h3>
              <p className="feature-description">Monitor your accomplishments and stay motivated.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FiTrendingUp />
              </div>
              <h3 className="feature-title">Boost Productivity</h3>
              <p className="feature-description">Streamline your workflow and get more done every day.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FiShield />
              </div>
              <h3 className="feature-title">Secure & Reliable</h3>
              <p className="feature-description">Your data is safe with us, always.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Removed */}
    </div>
  );
};

export default Home;