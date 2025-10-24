import {convertImage} from './convertImage';
import {loadImage} from './loadImage';
import {WatermarkitError} from './error';

import type {ImageFormat} from '../types';

export async function getImageData(file: File): Promise<ImageData> {
  let base64 = await fileToBase64(file);
  let img = await loadImage(base64);

  const format = getFileFormat(file.name);

  // Satori can't render WebP and Avif base64, so we convert to PNG
  if (format === 'webp' || format === 'avif') {
    base64 = await convertImage(img, 'png', {output: 'base64'});
    img = await loadImage(base64);
  }

  return {
    width: img.width,
    height: img.height,
    filename: file.name.replace(/\.$|\.[^/.]+$/, ''),
    base64,
    format,
  };
}

export interface ImageData {
  width: number;
  height: number;
  filename: string;
  base64: string;
  format: ImageFormat;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new WatermarkitError('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

export function getFileFormat(filename: string): ImageFormat {
  const parts = filename.split('.');
  if (parts.length <= 1 || parts.at(-1) === '') {
    return 'png';
  }

  const extension = parts.pop()?.toLowerCase() || '';
  if (extension === 'jpg') {
    return 'jpeg';
  }

  return (extension as ImageFormat) || 'png';
}
