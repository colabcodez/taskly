import React from 'react';
import { FiX } from 'react-icons/fi';
import './KeyboardShortcuts.css';

const KeyboardShortcuts = ({ isOpen, onClose, shortcuts }) => {
  if (!isOpen) return null;

  return (
    <div className="shortcuts-overlay" onClick={onClose}>
      <div className="shortcuts-modal" onClick={(e) => e.stopPropagation()}>
        <div className="shortcuts-header">
          <h3>Keyboard Shortcuts</h3>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <div className="shortcuts-content">
          <div className="shortcuts-section">
            <h4>Navigation</h4>
            <div className="shortcuts-list">
              {shortcuts.filter(s => s.keys.startsWith('ctrl+') && !s.keys.includes('shift')).map((shortcut, index) => (
                <div key={index} className="shortcut-item">
                  <div className="shortcut-keys">
                    {shortcut.keys.split('+').map((key, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <span className="key-separator">+</span>}
                        <kbd className="key">{key === 'ctrl' ? 'Ctrl' : key}</kbd>
                      </React.Fragment>
                    ))}
                  </div>
                  <span className="shortcut-description">{shortcut.description}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="shortcuts-section">
            <h4>Actions</h4>
            <div className="shortcuts-list">
              {shortcuts.filter(s => !s.keys.startsWith('ctrl+') || s.keys.includes('shift')).map((shortcut, index) => (
                <div key={index} className="shortcut-item">
                  <div className="shortcut-keys">
                    {shortcut.keys.split('+').map((key, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <span className="key-separator">+</span>}
                        <kbd className="key">
                          {key === 'ctrl' ? 'Ctrl' : 
                           key === 'shift' ? 'Shift' : 
                           key === 'alt' ? 'Alt' : 
                           key === 'escape' ? 'Esc' : key}
                        </kbd>
                      </React.Fragment>
                    ))}
                  </div>
                  <span className="shortcut-description">{shortcut.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="shortcuts-footer">
          <p>Press <kbd>Esc</kbd> to close this help</p>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;
