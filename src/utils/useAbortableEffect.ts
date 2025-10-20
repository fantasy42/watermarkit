import * as React from 'react';

export function useAbortableEffect(
  callback: (signal: AbortSignal) => ReturnType<React.EffectCallback>,
  deps: React.DependencyList
) {
  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const f = callback(signal);
    return () => {
      controller.abort();
      f?.();
    };
  }, deps);
  /* eslint-enable react-hooks/exhaustive-deps */
}
export const useEffect = useAbortableEffect;
