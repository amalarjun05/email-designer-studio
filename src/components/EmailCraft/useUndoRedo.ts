import { useState, useCallback, useRef } from 'react';

interface UseUndoRedoOptions<T> {
  maxHistory?: number;
}

export function useUndoRedo<T>(initialState: T, options: UseUndoRedoOptions<T> = {}) {
  const { maxHistory = 50 } = options;
  
  const [state, setState] = useState<T>(initialState);
  const historyRef = useRef<T[]>([initialState]);
  const currentIndexRef = useRef(0);
  const isInternalUpdateRef = useRef(false);

  const canUndo = currentIndexRef.current > 0;
  const canRedo = currentIndexRef.current < historyRef.current.length - 1;

  const pushState = useCallback((newState: T) => {
    if (isInternalUpdateRef.current) {
      isInternalUpdateRef.current = false;
      return;
    }

    // Remove any redo states
    historyRef.current = historyRef.current.slice(0, currentIndexRef.current + 1);
    
    // Add new state
    historyRef.current.push(newState);
    
    // Limit history size
    if (historyRef.current.length > maxHistory) {
      historyRef.current = historyRef.current.slice(-maxHistory);
    }
    
    currentIndexRef.current = historyRef.current.length - 1;
    setState(newState);
  }, [maxHistory]);

  const undo = useCallback(() => {
    if (!canUndo) return;
    
    currentIndexRef.current -= 1;
    isInternalUpdateRef.current = true;
    const previousState = historyRef.current[currentIndexRef.current];
    setState(previousState);
    return previousState;
  }, [canUndo]);

  const redo = useCallback(() => {
    if (!canRedo) return;
    
    currentIndexRef.current += 1;
    isInternalUpdateRef.current = true;
    const nextState = historyRef.current[currentIndexRef.current];
    setState(nextState);
    return nextState;
  }, [canRedo]);

  const reset = useCallback((newInitialState: T) => {
    historyRef.current = [newInitialState];
    currentIndexRef.current = 0;
    setState(newInitialState);
  }, []);

  return {
    state,
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset
  };
}
