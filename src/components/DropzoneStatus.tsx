import * as React from 'react';

import {useDropzoneContext} from './DropzoneContext';

import type {DropzoneContext} from './DropzoneContext';

type DropzoneStatusProps = {
  children: React.ReactElement;
};

function createDropzoneStatus(status: keyof DropzoneContext) {
  const Component: React.FC<DropzoneStatusProps> = ({children}) => {
    const context = useDropzoneContext();

    return context[status] ? children : null;
  };

  Component.displayName = `Dropzone${status[0].toUpperCase()}${status.slice(1)}`;

  return Component;
}

export const DropzoneAccept = createDropzoneStatus('accept');
export const DropzoneReject = createDropzoneStatus('reject');
export const DropzoneIdle = createDropzoneStatus('idle');
