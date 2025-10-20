import * as React from 'react';

import {WatermarkitError} from './error';

export function useResvgWorker() {
  const workerRef = React.useRef<Worker | null>(null);
  const pendingRef = React.useRef(
    new Map<number, (result: string | Error) => void>()
  );

  React.useEffect(() => {
    const worker = new Worker(new URL('../resvgWorker.ts', import.meta.url), {
      type: 'module',
    });
    workerRef.current = worker;
    const pending = pendingRef.current;

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const {_id, pngBuffer, error} = event.data;
      const resolver = pending.get(_id);
      if (!resolver) {
        return;
      }

      if (error) {
        resolver(
          new WatermarkitError(
            "We couldn't download the image. Please try again."
          )
        );
      } else if (pngBuffer) {
        // Worker returned a PNG buffer → convert to Blob URL
        const blob = new Blob([pngBuffer], {type: 'image/png'});
        const url = URL.createObjectURL(blob);
        resolver(url);
      }

      pending.delete(_id);
    };

    worker.onerror = () => {
      for (const [, resolver] of pending.entries()) {
        resolver(
          new WatermarkitError(
            "We couldn't download the image. Please try again."
          )
        );
      }
      pending.clear();
    };

    return () => {
      worker.terminate();
      workerRef.current = null;
      pending.clear();
    };
  }, []);

  return React.useCallback((message: {svg: string}, timeout = 60_000) => {
    return new Promise<string>((resolve, reject) => {
      const _id = idCounter++;

      // Timeout handler: reject if worker takes too long
      const timer = setTimeout(() => {
        pendingRef.current.delete(_id);
        reject(
          new WatermarkitError(
            'The image took too long to render. Please try again.'
          )
        );
      }, timeout);

      pendingRef.current.set(_id, (result) => {
        clearTimeout(timer);
        if (result instanceof Error) reject(result);
        else resolve(result);
      });

      workerRef.current?.postMessage({...message, _id});
    });
  }, []);
}

// Simple counter for generating unique request IDs
let idCounter = 0;

interface WorkerResponse {
  _id: number;
  pngBuffer?: ArrayBuffer;
  error?: string;
}
