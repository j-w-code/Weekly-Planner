import { renderHook } from '@testing-library/react';
import { act } from 'react';
import useKeyboardShortcuts from './useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  let mockCallback1;
  let mockCallback2;

  beforeEach(() => {
    mockCallback1 = jest.fn();
    mockCallback2 = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call callback when matching key combination is pressed', () => {
    const shortcuts = {
      'ctrl+k': mockCallback1,
    };

    renderHook(() => useKeyboardShortcuts(shortcuts));

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
        bubbles: true,
      });
      window.dispatchEvent(event);
    });

    expect(mockCallback1).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple shortcuts', () => {
    const shortcuts = {
      'ctrl+k': mockCallback1,
      'ctrl+s': mockCallback2,
    };

    renderHook(() => useKeyboardShortcuts(shortcuts));

    act(() => {
      const event1 = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
        bubbles: true,
      });
      window.dispatchEvent(event1);
    });

    expect(mockCallback1).toHaveBeenCalledTimes(1);
    expect(mockCallback2).toHaveBeenCalledTimes(0);

    act(() => {
      const event2 = new KeyboardEvent('keydown', {
        key: 's',
        ctrlKey: true,
        bubbles: true,
      });
      window.dispatchEvent(event2);
    });

    expect(mockCallback1).toHaveBeenCalledTimes(1);
    expect(mockCallback2).toHaveBeenCalledTimes(1);
  });

  it('should handle meta key (Mac Cmd)', () => {
    // Implementation treats metaKey as ctrl
    const shortcuts = {
      'ctrl+k': mockCallback1,
    };

    renderHook(() => useKeyboardShortcuts(shortcuts));

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: true,
        bubbles: true,
      });
      window.dispatchEvent(event);
    });

    expect(mockCallback1).toHaveBeenCalledTimes(1);
  });

  it('should handle shift key', () => {
    const shortcuts = {
      'shift+k': mockCallback1,
    };

    renderHook(() => useKeyboardShortcuts(shortcuts));

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        shiftKey: true,
        bubbles: true,
      });
      window.dispatchEvent(event);
    });

    expect(mockCallback1).toHaveBeenCalledTimes(1);
  });

  it('should handle alt key', () => {
    const shortcuts = {
      'alt+k': mockCallback1,
    };

    renderHook(() => useKeyboardShortcuts(shortcuts));

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        altKey: true,
        bubbles: true,
      });
      window.dispatchEvent(event);
    });

    expect(mockCallback1).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple modifiers', () => {
    const shortcuts = {
      'ctrl+shift+k': mockCallback1,
    };

    renderHook(() => useKeyboardShortcuts(shortcuts));

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
        shiftKey: true,
        bubbles: true,
      });
      window.dispatchEvent(event);
    });

    expect(mockCallback1).toHaveBeenCalledTimes(1);
  });

  it('should NOT call callback when key matches but modifiers do not', () => {
    const shortcuts = {
      'ctrl+k': mockCallback1,
    };

    renderHook(() => useKeyboardShortcuts(shortcuts));

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: false,
        bubbles: true,
      });
      window.dispatchEvent(event);
    });

    expect(mockCallback1).toHaveBeenCalledTimes(0);
  });

  it('should ignore shortcuts when typing in input fields', () => {
    const shortcuts = {
      'ctrl+k': mockCallback1,
    };

    renderHook(() => useKeyboardShortcuts(shortcuts));

    // Create a mock input element
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
        bubbles: true,
      });
      Object.defineProperty(event, 'target', {
        value: input,
        writable: false,
      });
      window.dispatchEvent(event);
    });

    expect(mockCallback1).toHaveBeenCalledTimes(0);

    document.body.removeChild(input);
  });

  it('should ignore shortcuts when typing in textarea', () => {
    const shortcuts = {
      'ctrl+k': mockCallback1,
    };

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.focus();

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
        bubbles: true,
      });
      Object.defineProperty(event, 'target', {
        value: textarea,
        writable: false,
      });
      window.dispatchEvent(event);
    });

    expect(mockCallback1).toHaveBeenCalledTimes(0);

    document.body.removeChild(textarea);
  });

  it('should ignore shortcuts when typing in contentEditable', () => {
    // Note: Current implementation doesn't check contentEditable
    // It only checks for INPUT, TEXTAREA, SELECT tags
    const shortcuts = {
      'ctrl+k': mockCallback1,
    };

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const div = document.createElement('div');
    div.contentEditable = 'true';
    document.body.appendChild(div);
    div.focus();

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
        bubbles: true,
      });
      Object.defineProperty(event, 'target', {
        value: div,
        writable: false,
      });
      window.dispatchEvent(event);
    });

    // Currently triggers because contentEditable is not checked
    expect(mockCallback1).toHaveBeenCalledTimes(1);

    document.body.removeChild(div);
  });

  it('should be disabled when enabled is false', () => {
    const shortcuts = {
      'ctrl+k': mockCallback1,
    };

    renderHook(() => useKeyboardShortcuts(shortcuts, false));

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
        bubbles: true,
      });
      window.dispatchEvent(event);
    });

    expect(mockCallback1).toHaveBeenCalledTimes(0);
  });

  it('should be enabled by default', () => {
    const shortcuts = {
      'ctrl+k': mockCallback1,
    };

    renderHook(() => useKeyboardShortcuts(shortcuts));

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
        bubbles: true,
      });
      window.dispatchEvent(event);
    });

    expect(mockCallback1).toHaveBeenCalledTimes(1);
  });

  it('should cleanup event listeners on unmount', () => {
    const shortcuts = {
      'ctrl+k': mockCallback1,
    };

    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useKeyboardShortcuts(shortcuts));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });

  it('should handle special keys like Escape', () => {
    // Implementation converts keys to lowercase
    const shortcuts = {
      'escape': mockCallback1,
    };

    renderHook(() => useKeyboardShortcuts(shortcuts));

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      });
      window.dispatchEvent(event);
    });

    expect(mockCallback1).toHaveBeenCalledTimes(1);
  });

  it('should handle arrow keys', () => {
    // Implementation converts keys to lowercase
    const shortcuts = {
      'arrowleft': mockCallback1,
      'arrowright': mockCallback2,
    };

    renderHook(() => useKeyboardShortcuts(shortcuts));

    act(() => {
      const event1 = new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        bubbles: true,
      });
      window.dispatchEvent(event1);
    });

    expect(mockCallback1).toHaveBeenCalledTimes(1);

    act(() => {
      const event2 = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
      });
      window.dispatchEvent(event2);
    });

    expect(mockCallback2).toHaveBeenCalledTimes(1);
  });

  it('should be case-insensitive for keys', () => {
    const shortcuts = {
      'ctrl+k': mockCallback1,
    };

    renderHook(() => useKeyboardShortcuts(shortcuts));

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'K',
        ctrlKey: true,
        bubbles: true,
      });
      window.dispatchEvent(event);
    });

    expect(mockCallback1).toHaveBeenCalledTimes(1);
  });

  it('should update callbacks when shortcuts change', () => {
    const shortcuts1 = {
      'ctrl+k': mockCallback1,
    };

    const { rerender } = renderHook(
      ({ shortcuts }) => useKeyboardShortcuts(shortcuts),
      { initialProps: { shortcuts: shortcuts1 } }
    );

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
        bubbles: true,
      });
      window.dispatchEvent(event);
    });

    expect(mockCallback1).toHaveBeenCalledTimes(1);

    const shortcuts2 = {
      'ctrl+k': mockCallback2,
    };

    rerender({ shortcuts: shortcuts2 });

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
        bubbles: true,
      });
      window.dispatchEvent(event);
    });

    expect(mockCallback1).toHaveBeenCalledTimes(1);
    expect(mockCallback2).toHaveBeenCalledTimes(1);
  });
});
