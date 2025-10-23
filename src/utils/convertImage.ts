import {WatermarkitError} from './error';
import {loadImage} from './loadImage';

import type {ImageFormat} from '../types';

const DEFAULT_OPTIONS: ConvertImageOptions = {
  output: 'url',
  quality: 0.92,
};

export async function convertImage(
  source: string | HTMLImageElement,
  format: ImageFormat,
  options: ConvertImageOptions = DEFAULT_OPTIONS
): Promise<string> {
  try {
    const img = typeof source === 'string' ? await loadImage(source) : source;
    const canvas = getSharedCanvas(img.width, img.height);
    const context = canvas.getContext('2d');

    if (!context) {
      throw new WatermarkitError('Failed to create canvas context');
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0);

    const blob = await canvasToBlob(canvas, format, options.quality);

    if (options.output === 'base64') {
      return await blobToBase64(blob);
    }

    return URL.createObjectURL(blob);
  } catch {
    throw new WatermarkitError(`Failed to convert image`);
  }
}

interface ConvertImageOptions {
  quality?: number;
  output?: 'base64' | 'url';
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: ImageFormat,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new WatermarkitError('Failed to create blob')),
      `image/${format}`,
      quality
    );
  });
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () =>
      reject(new WatermarkitError('Failed to convert blob to base64'));
    reader.readAsDataURL(blob);
  });
}

// Reuse a single canvas instance to avoid unnecessary DOM allocations
let sharedCanvas: HTMLCanvasElement | null = null;
function getSharedCanvas(width: number, height: number): HTMLCanvasElement {
  if (!sharedCanvas) {
    sharedCanvas = document.createElement('canvas');
  }
  sharedCanvas.width = width;
  sharedCanvas.height = height;
  return sharedCanvas;
}
