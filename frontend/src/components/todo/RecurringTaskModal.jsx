import React, { useState } from 'react';
import { FiX, FiRepeat, FiCalendar } from 'react-icons/fi';
import './RecurringTaskModal.css';

const RecurringTaskModal = ({ isOpen, onClose, onSubmit, taskData = {} }) => {
  const [formData, setFormData] = useState({
    title: taskData.title || '',
    body: taskData.body || '',
    priority: taskData.priority || 'medium',
    category: taskData.category || 'general',
    tags: taskData.tags || [],
    isRecurring: true,
    recurringPattern: 'daily',
    recurringInterval: 1,
    dueDate: taskData.dueDate || '',
    endDate: '',
    ...taskData
  });

  const [newTag, setNewTag] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagAdd = (e) => {
    e.preventDefault();
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content recurring-modal">
        <div className="modal-header">
          <div className="modal-title">
            <FiRepeat className="title-icon" />
            <h2>Create Recurring Task</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="task-input"
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="body"
              value={formData.body}
              onChange={handleChange}
              className="task-textarea"
              placeholder="Enter task description"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="task-select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="task-input"
                placeholder="e.g., Work, Personal"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tags</label>
            <div className="tags-container">
              <div className="tags-list">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="tag-item">
                    {tag}
                    <button
                      type="button"
                      className="tag-remove"
                      onClick={() => handleTagRemove(tag)}
                    >
                      <FiX />
                    </button>
                  </span>
                ))}
              </div>
              <form onSubmit={handleTagAdd} className="tag-input-form">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag..."
                  className="tag-input"
                />
                <button type="submit" className="tag-add-btn">
                  Add
                </button>
              </form>
            </div>
          </div>

          <div className="recurring-section">
            <div className="section-header">
              <FiRepeat className="section-icon" />
              <h3>Recurrence Settings</h3>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Repeat Every</label>
                <input
                  type="number"
                  name="recurringInterval"
                  value={formData.recurringInterval}
                  onChange={handleChange}
                  className="task-input"
                  min="1"
                  max="365"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Period</label>
                <select
                  name="recurringPattern"
                  value={formData.recurringPattern}
                  onChange={handleChange}
                  className="task-select"
                >
                  <option value="daily">Day(s)</option>
                  <option value="weekly">Week(s)</option>
                  <option value="monthly">Month(s)</option>
                  <option value="yearly">Year(s)</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input
                  type="datetime-local"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="task-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Date (Optional)</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="task-input"
                />
              </div>
            </div>

            <div className="recurring-preview">
              <div className="preview-label">
                <FiCalendar className="preview-icon" />
                <span>Preview:</span>
              </div>
              <div className="preview-text">
                {formData.recurringInterval === 1 
                  ? `Every ${formData.recurringPattern.slice(0, -2)}`
                  : `Every ${formData.recurringInterval} ${formData.recurringPattern}`
                }
                {formData.dueDate && (
                  <span> starting {new Date(formData.dueDate).toLocaleDateString()}</span>
                )}
                {formData.endDate && (
                  <span> until {new Date(formData.endDate).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <FiRepeat />
              Create Recurring Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecurringTaskModal;
