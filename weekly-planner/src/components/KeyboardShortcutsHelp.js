import React from 'react';
import './KeyboardShortcutsHelp.css';

function KeyboardShortcutsHelp({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content shortcuts-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⌨️ Keyboard Shortcuts</h2>
          <button className="close-button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        
        <div className="shortcuts-content">
          <section className="shortcuts-section">
            <h3>Navigation</h3>
            <div className="shortcuts-list">
              <div className="shortcut-item">
                <kbd>←</kbd>
                <span>Previous week</span>
              </div>
              <div className="shortcut-item">
                <kbd>→</kbd>
                <span>Next week</span>
              </div>
              <div className="shortcut-item">
                <kbd>T</kbd>
                <span>Go to today</span>
              </div>
            </div>
          </section>

          <section className="shortcuts-section">
            <h3>Actions</h3>
            <div className="shortcuts-list">
              <div className="shortcut-item">
                <kbd>N</kbd>
                <span>New event</span>
              </div>
              <div className="shortcut-item">
                <kbd>S</kbd>
                <span>New sequence</span>
              </div>
              <div className="shortcut-item">
                <kbd>ESC</kbd>
                <span>Close modal/Cancel</span>
              </div>
            </div>
          </section>

          <section className="shortcuts-section">
            <h3>Help</h3>
            <div className="shortcuts-list">
              <div className="shortcut-item">
                <kbd>?</kbd>
                <span>Show this help</span>
              </div>
            </div>
          </section>

          <section className="shortcuts-section">
            <h3>Modifiers</h3>
            <div className="shortcuts-list">
              <div className="shortcut-item">
                <kbd>Ctrl</kbd> / <kbd>⌘</kbd>
                <span>Command key (Mac/Windows)</span>
              </div>
              <div className="shortcut-item">
                <kbd>Alt</kbd>
                <span>Alternative actions</span>
              </div>
            </div>
          </section>
        </div>

        <div className="shortcuts-footer">
          <p>💡 Tip: Press <kbd>?</kbd> anytime to see these shortcuts</p>
        </div>
      </div>
    </div>
  );
}

export default KeyboardShortcutsHelp;
