import React from "react";
import { FiTrash2, FiCheck } from "react-icons/fi";
import Subtasks from "./Subtasks";
import FileAttachments from "./FileAttachments";

const TodoCards = ({
  title,
  body,
  id,
  delid,
  isDeleting = false,
  completed = false,
  onToggleCompletion,
  priority = 'medium',
  dueDate = null,
  category = 'general',
  tags = [],
  subtasks = [],
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  attachments = [],
  onAddAttachment,
  onDeleteAttachment,
}) => {
  return (
    <div className={`task-item ${isDeleting ? 'deleting' : ''} ${completed ? 'completed' : ''}`}>
      <div className="task-checkbox">
        <button
          className={`checkbox-btn ${completed ? 'checked' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("Checkbox clicked for task:", id);
            onToggleCompletion(id, completed);
          }}
          disabled={isDeleting}
          title={completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {completed && <FiCheck />}
        </button>
      </div>
      <div className="task-content">
        <div className="task-header">
          <span className={`task-text ${completed ? 'completed-text' : ''}`}>{title}</span>
          <div className="task-meta">
            <span className={`priority-badge priority-${priority}`}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </span>
            {dueDate && (
              <span className={`due-date ${new Date(dueDate) < new Date() && !completed ? 'overdue' : ''}`}>
                {new Date(dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        {body && (
          <div 
            className={`task-description rich-text-content ${completed ? 'completed-text' : ''}`}
            dangerouslySetInnerHTML={{ __html: body }}
          />
        )}
        <div className="task-tags">
          {category !== 'general' && (
            <span className="category-tag">{category}</span>
          )}
          {tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      </div>

      {/* Subtasks */}
      {subtasks && subtasks.length > 0 && (
        <Subtasks
          taskId={id}
          subtasks={subtasks}
          onAddSubtask={onAddSubtask}
          onToggleSubtask={onToggleSubtask}
          onDeleteSubtask={onDeleteSubtask}
          disabled={isDeleting}
        />
      )}

      {/* File Attachments */}
      {attachments && attachments.length > 0 && (
        <FileAttachments
          taskId={id}
          attachments={attachments}
          onAddAttachment={onAddAttachment}
          onDeleteAttachment={onDeleteAttachment}
          disabled={isDeleting}
        />
      )}

      <div className="task-actions">
        <button
          className="action-btn delete-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("Delete button clicked for task:", id);
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