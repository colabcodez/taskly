import React, { useState, useRef } from 'react';
import { FiPaperclip, FiX, FiDownload, FiFile, FiImage, FiFileText, FiVideo, FiMusic } from 'react-icons/fi';
import './FileAttachments.css';

const FileAttachments = ({ 
  taskId, 
  attachments = [], 
  onAddAttachment, 
  onDeleteAttachment, 
  disabled = false 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <FiImage />;
    if (fileType.startsWith('video/')) return <FiVideo />;
    if (fileType.startsWith('audio/')) return <FiMusic />;
    if (fileType.includes('pdf') || fileType.includes('document') || fileType.includes('text')) {
      return <FiFileText />;
    }
    return <FiFile />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('taskId', taskId);
        
        const response = await fetch('/api/v2/uploadAttachment', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const result = await response.json();
          onAddAttachment(result.attachment);
        } else {
          throw new Error('Upload failed');
        }
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownload = async (attachment) => {
    try {
      const response = await fetch(`/api/v2/downloadAttachment/${attachment.id}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = attachment.originalName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file');
    }
  };

  const handleDelete = async (attachmentId) => {
    if (window.confirm('Are you sure you want to delete this attachment?')) {
      try {
        const response = await fetch(`/api/v2/deleteAttachment/${attachmentId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          onDeleteAttachment(attachmentId);
        } else {
          throw new Error('Delete failed');
        }
      } catch (error) {
        console.error('Error deleting attachment:', error);
        alert('Failed to delete attachment');
      }
    }
  };

  return (
    <div className="file-attachments">
      <div className="attachments-header">
        <div className="attachments-title">
          <FiPaperclip className="title-icon" />
          <span>Attachments ({attachments.length})</span>
        </div>
        <button
          className="add-attachment-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
        >
          <FiPaperclip />
          {isUploading ? 'Uploading...' : 'Add Files'}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        accept="*/*"
      />

      {attachments.length > 0 && (
        <div className="attachments-list">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="attachment-item">
              <div className="attachment-info">
                <div className="attachment-icon">
                  {getFileIcon(attachment.mimeType)}
                </div>
                <div className="attachment-details">
                  <div className="attachment-name" title={attachment.originalName}>
                    {attachment.originalName}
                  </div>
                  <div className="attachment-meta">
                    <span className="attachment-size">
                      {formatFileSize(attachment.size)}
                    </span>
                    <span className="attachment-date">
                      {new Date(attachment.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="attachment-actions">
                <button
                  className="action-btn download-btn"
                  onClick={() => handleDownload(attachment)}
                  title="Download"
                >
                  <FiDownload />
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(attachment.id)}
                  disabled={disabled}
                  title="Delete"
                >
                  <FiX />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {attachments.length === 0 && (
        <div className="no-attachments">
          <FiPaperclip className="no-attachments-icon" />
          <p>No attachments yet</p>
          <button
            className="add-first-attachment-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
          >
            <FiPaperclip />
            Add your first attachment
          </button>
        </div>
      )}
    </div>
  );
};

export default FileAttachments;
