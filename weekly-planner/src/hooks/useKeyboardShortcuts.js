import { useEffect, useCallback } from 'react';

/**
 * Custom hook for managing keyboard shortcuts
 * @param {Object} shortcuts - Object mapping key combinations to handlers
 * @param {boolean} enabled - Whether shortcuts are enabled
 */
export function useKeyboardShortcuts(shortcuts, enabled = true) {
  const handleKeyDown = useCallback((event) => {
    if (!enabled) return;

    // Don't trigger shortcuts when typing in input fields
    const isInputField = ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName);
    
    // Build key combination string
    const key = event.key.toLowerCase();
    const modifiers = [];
    
    if (event.ctrlKey || event.metaKey) modifiers.push('ctrl');
    if (event.altKey) modifiers.push('alt');
    if (event.shiftKey) modifiers.push('shift');
    
    const combo = modifiers.length > 0 ? `${modifiers.join('+')}+${key}` : key;

    // Check if we have a handler for this combination
    const handler = shortcuts[combo];
    
    if (handler) {
      // Don't trigger if typing in input field (except for ESC)
      if (isInputField && key !== 'escape') return;
      
      event.preventDefault();
      handler(event);
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
}

/**
 * Hook for managing a single keyboard shortcut
 */
export function useKeyboardShortcut(key, handler, enabled = true) {
  useKeyboardShortcuts({ [key]: handler }, enabled);
}

export default useKeyboardShortcuts;
