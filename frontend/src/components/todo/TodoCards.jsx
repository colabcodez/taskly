import React from "react";
import { FiEdit2, FiTrash2, FiCheck } from "react-icons/fi";

const TodoCards = ({
  title,
  body,
  id,
  delid,
  display,
  updateId,
  toBeUpdate,
  isDeleting = false,
  completed = false,
  onToggleCompletion,
}) => {
  return (
    <div className={`task-item ${isDeleting ? 'deleting' : ''} ${completed ? 'completed' : ''}`}>
      <div className="task-checkbox">
        <button
          className={`checkbox-btn ${completed ? 'checked' : ''}`}
          onClick={() => onToggleCompletion(id, completed)}
          disabled={isDeleting}
          title={completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {completed && <FiCheck />}
        </button>
      </div>
      <div className="task-content">
        <span className={`task-text ${completed ? 'completed-text' : ''}`}>{title}</span>
        {body && <span className={`task-time ${completed ? 'completed-text' : ''}`}>{body}</span>}
      </div>
      <div className="task-actions">
        <button
          className="action-btn update-btn"
          onClick={() => {
            if (!isDeleting) {
              display("block");
              toBeUpdate(updateId);
            }
          }}
          disabled={isDeleting}
          title="Update task"
        >
          <FiEdit2 />
        </button>
        <button
          className="action-btn delete-btn"
          onClick={() => {
            if (!isDeleting) {
              delid(id);
            }
          }}
          disabled={isDeleting}
          title="Delete task"
        >
          {isDeleting ? (
            <div className="spinner-small"></div>
          ) : (
            <FiTrash2 />
          )}
        </button>
      </div>

      {isDeleting && (
        <div className="deleting-overlay">
          <div className="spinner-small"></div>
          <span>Deleting...</span>
        </div>
      )}
    </div>
  );
};

export default TodoCards;