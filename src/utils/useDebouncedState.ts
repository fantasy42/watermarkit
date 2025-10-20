import * as React from 'react';

import {useRetimer} from './useRetimer';

export function useDebouncedState<T>(
  defaultValue: T | (() => T),
  wait: number = 500,
  leading = false
) {
  const [value, setValue] = React.useState<T>(defaultValue);
  const leadingRef = React.useRef(true);
  const retimer = useRetimer();

  const debouncedSetValue = React.useCallback(
    (newValue: T) => {
      if (leadingRef.current && leading) {
        setValue(newValue);
      } else {
        retimer(
          setTimeout(() => {
            leadingRef.current = true;
            setValue(newValue);
          }, wait)
        );
      }
      leadingRef.current = false;
    },
    [leading, retimer, wait]
  );

  const forceSetValue = React.useCallback(
    (newValue: T) => {
      retimer();
      setValue(newValue);
    },
    [retimer]
  );

  return [value, debouncedSetValue, forceSetValue] as const;
}
