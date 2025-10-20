import * as React from 'react';

export interface DropzoneContext {
  idle: boolean;
  accept: boolean;
  reject: boolean;
}
export const DropzoneContext = React.createContext<DropzoneContext | undefined>(
  undefined
);

export function useDropzoneContext() {
  const context = React.use(DropzoneContext);
  if (context === undefined) {
    throw new Error(
      'DropzoneContext is missing. Dropzone parts must be placed within <Dropzone>.'
    );
  }

  return context;
}
