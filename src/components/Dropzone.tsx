'use client';
import * as React from 'react';
import {useDropzone} from 'react-dropzone';
import {Box} from '@radix-ui/themes';
import {clsx} from 'clsx';

import {DropzoneContext} from './DropzoneContext';

import type {Accept, FileRejection, FileWithPath} from 'react-dropzone';
import type {BoxProps} from '@radix-ui/themes';

export interface DropzoneProps extends Omit<BoxProps, 'onDrop'> {
  disabled?: boolean;
  loading?: boolean;
  accept?: Accept | string[];
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  activateOnClick?: boolean;
  activateOnDrag?: boolean;
  activateOnKeyboard?: boolean;
  onDrop: (files: FileWithPath[]) => void;
  onReject?: (fileRejections: FileRejection[]) => void;
  onDropAny?: (files: FileWithPath[], fileRejections: FileRejection[]) => void;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

function Dropzone(props: DropzoneProps) {
  const {
    children,
    className,
    disabled,
    loading,
    multiple,
    maxSize,
    accept,
    onDropAny,
    onDrop,
    onReject,
    maxFiles,
    activateOnClick = true,
    activateOnDrag = true,
    activateOnKeyboard = true,
    inputProps,
    ...dropZoneProps
  } = props;

  const {
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragReject,
    isDragActive,
  } = useDropzone({
    onDrop: onDropAny,
    onDropAccepted: onDrop,
    onDropRejected: onReject,
    disabled: disabled || loading,
    accept: Array.isArray(accept)
      ? Object.fromEntries(accept.map((key) => [key, []]))
      : accept,
    multiple,
    maxSize,
    maxFiles,
    noClick: !activateOnClick,
    noDrag: !activateOnDrag,
    noKeyboard: !activateOnKeyboard,
    useFsAccessApi: true,
  });

  const isAccepted = isDragActive && isDragAccept;
  const isRejected = isDragActive && isDragReject;
  const isIdle = !isAccepted && !isRejected;

  const status = isAccepted ? 'accepted' : isRejected ? 'rejected' : 'idle';

  const dropzoneContextValue = React.useMemo(
    () => ({accept: isAccepted, reject: isRejected, idle: isIdle}),
    [isAccepted, isRejected, isIdle]
  );

  return (
    <DropzoneContext value={dropzoneContextValue}>
      <Box
        className={clsx('Dropzone', className)}
        p="4"
        position="relative"
        overflow="hidden"
        {...getRootProps()}
        {...dropZoneProps}
        data-disabled={disabled || loading || undefined}
        data-loading={loading || undefined}
        dropzone-status={status}
      >
        <input {...getInputProps({'aria-label': 'Dropzone', ...inputProps})} />
        <Box className="DropzoneInner" height="100%" width="100%">
          {children}
        </Box>
      </Box>
    </DropzoneContext>
  );
}

export {Dropzone as Root};
export {
  DropzoneAccept as Accept,
  DropzoneIdle as Idle,
  DropzoneReject as Reject,
} from './DropzoneStatus';
export type {FileWithPath} from 'react-dropzone';
