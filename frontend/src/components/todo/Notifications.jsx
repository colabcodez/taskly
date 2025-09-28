import React, { useState } from 'react';
import { FiBell, FiX, FiCheck, FiClock, FiAlertCircle, FiInfo } from 'react-icons/fi';
import './Notifications.css';

const Notifications = ({ isOpen, onClose, notifications = [], onMarkAsRead, onClearAll }) => {
  const [filter, setFilter] = useState('all'); // all, unread, read

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'reminder':
        return <FiClock className="notification-icon reminder" />;
      case 'due':
        return <FiAlertCircle className="notification-icon due" />;
      case 'overdue':
        return <FiAlertCircle className="notification-icon overdue" />;
      case 'completed':
        return <FiCheck className="notification-icon completed" />;
      default:
        return <FiInfo className="notification-icon info" />;
    }
  };

  const getNotificationClass = (type) => {
    switch (type) {
      case 'reminder':
        return 'notification-item reminder';
      case 'due':
        return 'notification-item due';
      case 'overdue':
        return 'notification-item overdue';
      case 'completed':
        return 'notification-item completed';
      default:
        return 'notification-item info';
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return notificationDate.toLocaleDateString();
  };

  const handleMarkAsRead = (notificationId) => {
    onMarkAsRead(notificationId);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      onClearAll();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content notifications-modal">
        <div className="modal-header">
          <div className="modal-title">
            <FiBell className="title-icon" />
            <h2>Notifications</h2>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
          </div>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          {notifications.length > 0 ? (
            <>
              <div className="notifications-header">
                <div className="filter-tabs">
                  <button
                    className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
                    onClick={() => setFilter('unread')}
                  >
                    Unread ({unreadCount})
                  </button>
                  <button
                    className={`filter-tab ${filter === 'read' ? 'active' : ''}`}
                    onClick={() => setFilter('read')}
                  >
                    Read ({notifications.length - unreadCount})
                  </button>
                </div>
                <button
                  className="clear-all-btn"
                  onClick={handleClearAll}
                  disabled={notifications.length === 0}
                >
                  Clear All
                </button>
              </div>

              <div className="notifications-list">
                {filteredNotifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`${getNotificationClass(notification.type)} ${notification.read ? 'read' : 'unread'}`}
                  >
                    <div className="notification-content">
                      <div className="notification-header">
                        <div className="notification-icon-container">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="notification-text">
                          <h4 className="notification-title">{notification.title}</h4>
                          <p className="notification-message">{notification.message}</p>
                        </div>
                        <div className="notification-meta">
                          <span className="notification-time">
                            {formatTime(notification.createdAt)}
                          </span>
                          {!notification.read && (
                            <button
                              className="mark-read-btn"
                              onClick={() => handleMarkAsRead(notification.id)}
                              title="Mark as read"
                            >
                              <FiCheck />
                            </button>
                          )}
                        </div>
                      </div>
                      {notification.taskTitle && (
                        <div className="notification-task">
                          <span className="task-label">Task:</span>
                          <span className="task-title">{notification.taskTitle}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-notifications">
              <FiBell className="no-notifications-icon" />
              <h3>No notifications</h3>
              <p>You're all caught up! Check back later for updates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
