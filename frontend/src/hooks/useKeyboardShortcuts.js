import { useEffect } from 'react';

export const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA' ||
        event.target.contentEditable === 'true'
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      const ctrlKey = event.ctrlKey || event.metaKey; // Support both Ctrl and Cmd
      const shiftKey = event.shiftKey;
      const altKey = event.altKey;

      // Create a key combination string
      const combination = [
        ctrlKey && 'ctrl',
        shiftKey && 'shift',
        altKey && 'alt',
        key
      ].filter(Boolean).join('+');

      // Find matching shortcut
      const shortcut = shortcuts.find(s => s.keys === combination);
      
      if (shortcut) {
        event.preventDefault();
        shortcut.action();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
};

export default useKeyboardShortcuts;
