import React, { useState } from 'react';
import { FiFileText, FiPlus, FiX, FiCopy, FiTrash2 } from 'react-icons/fi';
import './TaskTemplates.css';

const TaskTemplates = ({ isOpen, onClose, onApplyTemplate, onCreateFromTemplate }) => {
  const [templates, setTemplates] = useState([
    {
      id: '1',
      name: 'Project Planning',
      description: 'Template for planning a new project',
      category: 'Work',
      tasks: [
        { title: 'Define project scope', priority: 'high', completed: false },
        { title: 'Create project timeline', priority: 'high', completed: false },
        { title: 'Assign team members', priority: 'medium', completed: false },
        { title: 'Set up project tools', priority: 'medium', completed: false },
        { title: 'Create initial documentation', priority: 'low', completed: false }
      ]
    },
    {
      id: '2',
      name: 'Meeting Preparation',
      description: 'Template for preparing for important meetings',
      category: 'Work',
      tasks: [
        { title: 'Review agenda', priority: 'high', completed: false },
        { title: 'Prepare talking points', priority: 'high', completed: false },
        { title: 'Gather supporting materials', priority: 'medium', completed: false },
        { title: 'Test technology setup', priority: 'medium', completed: false },
        { title: 'Send meeting reminders', priority: 'low', completed: false }
      ]
    },
    {
      id: '3',
      name: 'Daily Routine',
      description: 'Template for daily productivity routine',
      category: 'Personal',
      tasks: [
        { title: 'Review daily goals', priority: 'high', completed: false },
        { title: 'Check emails', priority: 'medium', completed: false },
        { title: 'Exercise', priority: 'medium', completed: false },
        { title: 'Plan tomorrow', priority: 'low', completed: false }
      ]
    },
    {
      id: '4',
      name: 'Travel Planning',
      description: 'Template for planning a trip',
      category: 'Personal',
      tasks: [
        { title: 'Book flights', priority: 'high', completed: false },
        { title: 'Reserve accommodation', priority: 'high', completed: false },
        { title: 'Create itinerary', priority: 'medium', completed: false },
        { title: 'Pack essentials', priority: 'medium', completed: false },
        { title: 'Check travel documents', priority: 'high', completed: false }
      ]
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: 'Work',
    tasks: []
  });

  // const [editingTemplate, setEditingTemplate] = useState(null);

  const handleApplyTemplate = (template) => {
    onApplyTemplate(template);
    onClose();
  };

  const handleCreateFromTemplate = (template) => {
    onCreateFromTemplate(template);
    onClose();
  };

  const handleCreateTemplate = () => {
    if (newTemplate.name.trim() && newTemplate.tasks.length > 0) {
      const template = {
        ...newTemplate,
        id: Date.now().toString(),
        tasks: newTemplate.tasks.map(task => ({ ...task, completed: false }))
      };
      setTemplates(prev => [...prev, template]);
      setNewTemplate({ name: '', description: '', category: 'Work', tasks: [] });
      setShowCreateForm(false);
    }
  };

  const handleDeleteTemplate = (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setTemplates(prev => prev.filter(t => t.id !== templateId));
    }
  };

  const addTaskToTemplate = () => {
    setNewTemplate(prev => ({
      ...prev,
      tasks: [...prev.tasks, { title: '', priority: 'medium' }]
    }));
  };

  const updateTaskInTemplate = (index, field, value) => {
    setNewTemplate(prev => ({
      ...prev,
      tasks: prev.tasks.map((task, i) => 
        i === index ? { ...task, [field]: value } : task
      )
    }));
  };

  const removeTaskFromTemplate = (index) => {
    setNewTemplate(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content templates-modal">
        <div className="modal-header">
          <div className="modal-title">
            <FiFileText className="title-icon" />
            <h2>Task Templates</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          {!showCreateForm ? (
            <>
              <div className="templates-header">
                <p>Choose a template to quickly create multiple tasks</p>
                <button 
                  className="create-template-btn"
                  onClick={() => setShowCreateForm(true)}
                >
                  <FiPlus />
                  Create Template
                </button>
              </div>

              <div className="templates-grid">
                {templates.map(template => (
                  <div key={template.id} className="template-card">
                    <div className="template-header">
                      <div className="template-info">
                        <h3 className="template-name">{template.name}</h3>
                        <p className="template-description">{template.description}</p>
                        <span className="template-category">{template.category}</span>
                      </div>
                      <div className="template-actions">
                        {/* <button
                          className="action-btn edit-btn"
                          onClick={() => setEditingTemplate(template)}
                          title="Edit template"
                        >
                          <FiEdit3 />
                        </button> */}
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteTemplate(template.id)}
                          title="Delete template"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    
                    <div className="template-tasks">
                      <h4>Tasks ({template.tasks.length})</h4>
                      <ul className="tasks-preview">
                        {template.tasks.slice(0, 3).map((task, index) => (
                          <li key={index} className="task-preview">
                            <span className={`priority-dot priority-${task.priority}`}></span>
                            {task.title}
                          </li>
                        ))}
                        {template.tasks.length > 3 && (
                          <li className="more-tasks">+{template.tasks.length - 3} more tasks</li>
                        )}
                      </ul>
                    </div>

                    <div className="template-footer">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleApplyTemplate(template)}
                      >
                        <FiCopy />
                        Apply Template
                      </button>
                      <button
                        className="btn btn-ghost"
                        onClick={() => handleCreateFromTemplate(template)}
                      >
                        Create Tasks
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="create-template-form">
              <div className="form-header">
                <h3>Create New Template</h3>
                <button 
                  className="back-btn"
                  onClick={() => setShowCreateForm(false)}
                >
                  <FiX />
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">Template Name</label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                  className="form-input"
                  placeholder="Enter template name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                  className="form-textarea"
                  placeholder="Enter template description"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value }))}
                  className="form-select"
                >
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Health">Health</option>
                  <option value="Learning">Learning</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <div className="tasks-header">
                  <label className="form-label">Tasks</label>
                  <button
                    type="button"
                    className="add-task-btn"
                    onClick={addTaskToTemplate}
                  >
                    <FiPlus />
                    Add Task
                  </button>
                </div>

                <div className="template-tasks-list">
                  {newTemplate.tasks.map((task, index) => (
                    <div key={index} className="template-task-item">
                      <input
                        type="text"
                        value={task.title}
                        onChange={(e) => updateTaskInTemplate(index, 'title', e.target.value)}
                        className="task-title-input"
                        placeholder="Task title"
                      />
                      <select
                        value={task.priority}
                        onChange={(e) => updateTaskInTemplate(index, 'priority', e.target.value)}
                        className="task-priority-select"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                      <button
                        type="button"
                        className="remove-task-btn"
                        onClick={() => removeTaskFromTemplate(index)}
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCreateTemplate}
                  disabled={!newTemplate.name.trim() || newTemplate.tasks.length === 0}
                >
                  <FiPlus />
                  Create Template
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskTemplates;
