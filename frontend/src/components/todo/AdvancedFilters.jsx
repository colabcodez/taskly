import React, { useState } from 'react';
import { FiFilter, FiSearch, FiCalendar, FiTag, FiStar, FiSave, FiX } from 'react-icons/fi';
import './AdvancedFilters.css';

const AdvancedFilters = ({ 
  isOpen, 
  onClose, 
  onApplyFilters, 
  onSaveView, 
  savedViews = [],
  onLoadView,
  onDeleteView 
}) => {
  const [filters, setFilters] = useState({
    search: '',
    priority: '',
    category: '',
    tags: [],
    dueDate: {
      start: '',
      end: ''
    },
    completed: 'all',
    createdDate: {
      start: '',
      end: ''
    }
  });

  const [showSaveView, setShowSaveView] = useState(false);
  const [viewName, setViewName] = useState('');
  const [viewDescription, setViewDescription] = useState('');

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedFilterChange = (parent, field, value) => {
    setFilters(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleTagAdd = (tag) => {
    if (tag.trim() && !filters.tags.includes(tag.trim())) {
      setFilters(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleSaveView = () => {
    if (viewName.trim()) {
      const view = {
        id: Date.now().toString(),
        name: viewName.trim(),
        description: viewDescription.trim(),
        filters: { ...filters },
        createdAt: new Date()
      };
      onSaveView(view);
      setViewName('');
      setViewDescription('');
      setShowSaveView(false);
    }
  };

  const handleLoadView = (view) => {
    setFilters(view.filters);
    onApplyFilters(view.filters);
    onClose();
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      priority: '',
      category: '',
      tags: [],
      dueDate: { start: '', end: '' },
      completed: 'all',
      createdDate: { start: '', end: '' }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content advanced-filters-modal">
        <div className="modal-header">
          <div className="modal-title">
            <FiFilter className="title-icon" />
            <h2>Advanced Filters & Views</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          <div className="filters-container">
            {/* Search */}
            <div className="filter-section">
              <label className="filter-label">
                <FiSearch className="label-icon" />
                Search
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search tasks..."
                className="filter-input"
              />
            </div>

            {/* Priority Filter */}
            <div className="filter-section">
              <label className="filter-label">
                <FiStar className="label-icon" />
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="filter-select"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="filter-section">
              <label className="filter-label">
                <FiTag className="label-icon" />
                Category
              </label>
              <input
                type="text"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                placeholder="Filter by category..."
                className="filter-input"
              />
            </div>

            {/* Tags Filter */}
            <div className="filter-section">
              <label className="filter-label">
                <FiTag className="label-icon" />
                Tags
              </label>
              <div className="tags-input-container">
                <div className="tags-display">
                  {filters.tags.map((tag, index) => (
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
                <input
                  type="text"
                  placeholder="Add tags (press Enter)"
                  className="filter-input"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleTagAdd(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </div>

            {/* Due Date Filter */}
            <div className="filter-section">
              <label className="filter-label">
                <FiCalendar className="label-icon" />
                Due Date
              </label>
              <div className="date-range">
                <input
                  type="date"
                  value={filters.dueDate.start}
                  onChange={(e) => handleNestedFilterChange('dueDate', 'start', e.target.value)}
                  className="filter-input"
                  placeholder="From"
                />
                <span className="date-separator">to</span>
                <input
                  type="date"
                  value={filters.dueDate.end}
                  onChange={(e) => handleNestedFilterChange('dueDate', 'end', e.target.value)}
                  className="filter-input"
                  placeholder="To"
                />
              </div>
            </div>

            {/* Created Date Filter */}
            <div className="filter-section">
              <label className="filter-label">
                <FiCalendar className="label-icon" />
                Created Date
              </label>
              <div className="date-range">
                <input
                  type="date"
                  value={filters.createdDate.start}
                  onChange={(e) => handleNestedFilterChange('createdDate', 'start', e.target.value)}
                  className="filter-input"
                  placeholder="From"
                />
                <span className="date-separator">to</span>
                <input
                  type="date"
                  value={filters.createdDate.end}
                  onChange={(e) => handleNestedFilterChange('createdDate', 'end', e.target.value)}
                  className="filter-input"
                  placeholder="To"
                />
              </div>
            </div>

            {/* Completion Status */}
            <div className="filter-section">
              <label className="filter-label">Completion Status</label>
              <select
                value={filters.completed}
                onChange={(e) => handleFilterChange('completed', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Tasks</option>
                <option value="completed">Completed Only</option>
                <option value="pending">Pending Only</option>
              </select>
            </div>
          </div>

          {/* Saved Views */}
          {savedViews.length > 0 && (
            <div className="saved-views-section">
              <h3>Saved Views</h3>
              <div className="saved-views-list">
                {savedViews.map(view => (
                  <div key={view.id} className="saved-view-item">
                    <div className="view-info">
                      <h4>{view.name}</h4>
                      <p>{view.description}</p>
                      <span className="view-date">
                        {new Date(view.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="view-actions">
                      <button
                        className="action-btn load-btn"
                        onClick={() => handleLoadView(view)}
                        title="Load view"
                      >
                        Load
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => onDeleteView(view.id)}
                        title="Delete view"
                      >
                        <FiX />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save View Form */}
          {showSaveView && (
            <div className="save-view-form">
              <h3>Save Current View</h3>
              <div className="form-group">
                <label className="form-label">View Name</label>
                <input
                  type="text"
                  value={viewName}
                  onChange={(e) => setViewName(e.target.value)}
                  placeholder="Enter view name..."
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={viewDescription}
                  onChange={(e) => setViewDescription(e.target.value)}
                  placeholder="Enter view description..."
                  className="form-textarea"
                  rows="3"
                />
              </div>
              <div className="form-actions">
                <button
                  className="btn btn-ghost"
                  onClick={() => setShowSaveView(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSaveView}
                  disabled={!viewName.trim()}
                >
                  <FiSave />
                  Save View
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div className="footer-actions">
            <button
              className="btn btn-ghost"
              onClick={handleClearFilters}
            >
              Clear All
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowSaveView(true)}
            >
              <FiSave />
              Save View
            </button>
            <button
              className="btn btn-primary"
              onClick={handleApplyFilters}
            >
              <FiFilter />
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;
