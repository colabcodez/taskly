import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiCheck } from 'react-icons/fi';
import './Subtasks.css';

const Subtasks = ({ 
  taskId, 
  subtasks = [], 
  onAddSubtask, 
  onToggleSubtask, 
  onDeleteSubtask,
  disabled = false 
}) => {
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtaskText.trim() || disabled) return;

    try {
      await onAddSubtask(taskId, newSubtaskText.trim());
      setNewSubtaskText('');
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding subtask:', error);
    }
  };

  const handleToggleSubtask = async (subtaskId, completed) => {
    if (disabled) return;
    try {
      await onToggleSubtask(taskId, subtaskId, !completed);
    } catch (error) {
      console.error('Error toggling subtask:', error);
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    if (disabled) return;
    try {
      await onDeleteSubtask(taskId, subtaskId);
    } catch (error) {
      console.error('Error deleting subtask:', error);
    }
  };

  const completedCount = subtasks.filter(subtask => subtask.completed).length;
  const totalCount = subtasks.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="subtasks-container">
      <div className="subtasks-header">
        <div className="subtasks-title">
          <span>Subtasks</span>
          {totalCount > 0 && (
            <span className="subtasks-count">
              {completedCount}/{totalCount}
            </span>
          )}
        </div>
        {totalCount > 0 && (
          <div className="subtasks-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="progress-text">{Math.round(progressPercentage)}%</span>
          </div>
        )}
      </div>

      <div className="subtasks-list">
        {subtasks.map((subtask) => (
          <div key={subtask.id} className={`subtask-item ${subtask.completed ? 'completed' : ''}`}>
            <button
              className={`subtask-checkbox ${subtask.completed ? 'checked' : ''}`}
              onClick={() => handleToggleSubtask(subtask.id, subtask.completed)}
              disabled={disabled}
              title={subtask.completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {subtask.completed && <FiCheck />}
            </button>
            
            <span className={`subtask-text ${subtask.completed ? 'completed' : ''}`}>
              {subtask.text}
            </span>
            
            <button
              className="subtask-delete"
              onClick={() => handleDeleteSubtask(subtask.id)}
              disabled={disabled}
              title="Delete subtask"
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>

      {!isAdding ? (
        <button
          className="add-subtask-btn"
          onClick={() => setIsAdding(true)}
          disabled={disabled}
        >
          <FiPlus />
          Add subtask
        </button>
      ) : (
        <form className="add-subtask-form" onSubmit={handleAddSubtask}>
          <input
            type="text"
            value={newSubtaskText}
            onChange={(e) => setNewSubtaskText(e.target.value)}
            placeholder="Enter subtask..."
            className="subtask-input"
            autoFocus
            disabled={disabled}
          />
          <div className="subtask-form-actions">
            <button
              type="submit"
              className="subtask-save-btn"
              disabled={!newSubtaskText.trim() || disabled}
            >
              Add
            </button>
            <button
              type="button"
              className="subtask-cancel-btn"
              onClick={() => {
                setIsAdding(false);
                setNewSubtaskText('');
              }}
              disabled={disabled}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Subtasks;