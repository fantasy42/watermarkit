import * as React from 'react';
import {TextField} from '@radix-ui/themes';
import Color from 'colorjs.io';

interface ColorFieldProps extends React.ComponentProps<typeof TextField.Root> {
  value: string;
  onValueChange: (value: string) => void;
}

export function ColorField(props: ColorFieldProps) {
  const {
    value,
    onValueChange,
    disabled,
    onBlur,
    onChange,
    onKeyDownCapture,
    placeholder = 'Enter a color',
    readOnly,
    size,
    ...colorFieldProps
  } = props;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const parsed = toShortFormat(value) ?? DEFAULT_COLOR;

  const commit = (next: string) => {
    onValueChange(toCssFormat(next));
  };

  return (
    <div
      className="ColorFieldRoot"
      // Auto-select the text when clicking inside the input (if no selection exists)
      onMouseUp={() => {
        const inputHasFocus = document.activeElement === inputRef.current;
        if (inputHasFocus && !hasSelection(inputRef.current)) {
          inputRef.current?.select();
        }
      }}
    >
      <TextField.Root
        size={size}
        ref={inputRef}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        // On blur, normalize and commit the current value
        onBlur={(event) => {
          commit(parsed);
          onBlur?.(event);
        }}
        onChange={(event) => {
          onValueChange(event.currentTarget.value);
          onChange?.(event);
        }}
        onKeyDownCapture={(event) => {
          if (event.key === 'Enter') {
            commit(parsed);
            setTimeout(() => inputRef.current?.select());
            event.preventDefault();
          }
          if (event.key === 'Escape') {
            // Reset to last valid parsed value on Escape
            commit(parsed);
            setTimeout(() => inputRef.current?.select());
            event.stopPropagation();
          }
          onKeyDownCapture?.(event);
        }}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        type="text"
        value={value}
        variant="surface"
        {...colorFieldProps}
      >
        <TextField.Slot>
          <div className="ColorFieldSwatchWrapper">
            <input
              disabled={disabled || readOnly}
              className="ColorFieldSwatch"
              onChange={(event) => {
                const colorSpace = new Color(value).spaceId;
                const string = toShortFormat(
                  new Color(event.currentTarget.value).to(colorSpace).toString()
                );
                if (string) {
                  commit(string);
                }
                onChange?.(event);
              }}
              tabIndex={-1}
              type="color"
              // Native <input type="color"> only accepts 6-digit hex
              value={toCssFormat(
                toShortFormat(
                  new Color(toCssFormat(parsed))
                    .to('srgb')
                    .toString({format: 'hex'})
                )!
              )}
            />
            <div className="ColorFieldSwatchBorder" />
          </div>
        </TextField.Slot>
      </TextField.Root>
    </div>
  );
}

const DEFAULT_COLOR = '000000';

const hasSelection = (input: HTMLInputElement | null) => {
  if (input) {
    const {selectionStart, selectionEnd} = input;
    return (selectionEnd ?? 0) - (selectionStart ?? 0) > 0;
  }
  return false;
};

// Normalize a color string into a short format (hex or color function)
const toShortFormat = (value?: string): string | null => {
  if (!value) {
    return null;
  }
  value = toCssFormat(value.trim());

  const regexp = /((?:^(?:[0-9]|[a-f]){6})|(?:^(?:[0-9]|[a-f]){1,3}))/i;
  let [hex] = value.replace(/^#/, '').match(regexp) ?? [];

  let color: Color | undefined;

  if (isColorFunction(value)) {
    try {
      color = new Color(value);
      if (['srgb', 'hsl', 'hwb'].includes(color.spaceId)) {
        return toShortFormat(color.to('srgb').toString({format: 'hex'}));
      }
      const string_ = color.toString({precision: 3});
      return string_.startsWith('color')
        ? string_.replace('color(', '').replace(')', '')
        : string_;
    } catch {}
  }

  if (!hex) {
    return null;
  }

  // Expand shorthand hex values (#F → #FFFFFF, #FA → #FAFAFA, #FAB → #FFAABB)
  switch (hex.length) {
    case 1: {
      hex = hex.repeat(6);
      break;
    }
    case 2: {
      hex = hex.repeat(3);
      break;
    }
    case 3: {
      const [r, g, b] = [...hex];
      hex = `${r}${r}${g}${g}${b}${b}`;
    }
  }

  return hex.toUpperCase();
};

const toCssFormat = (value: string) => {
  if (isColorFunction(value)) {
    return value.includes('(') ? value : `color(${value})`;
  }
  if (value.startsWith('#')) {
    return value;
  }

  return '#' + value;
};

const isColorFunction = (value: string) =>
  value.startsWith('a98') ||
  value.startsWith('color') ||
  value.startsWith('display-p3') ||
  value.startsWith('hsl') ||
  value.startsWith('hwb') ||
  value.startsWith('lab') ||
  value.startsWith('lch') ||
  value.startsWith('oklab') ||
  value.startsWith('oklch') ||
  value.startsWith('p3') ||
  value.startsWith('prophoto') ||
  value.startsWith('rec2020') ||
  value.startsWith('rgb') ||
  value.startsWith('srgb') ||
  value.startsWith('xyz');
