import * as React from 'react';

export function useRetimer() {
  const timerIdRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  return React.useCallback((timerId?: ReturnType<typeof setTimeout>) => {
    if (timerIdRef.current !== null) {
      clearTimeout(timerIdRef.current);
    }
    timerIdRef.current = timerId ?? null;
  }, []);
}
