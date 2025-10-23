import {WatermarkitError} from './error';

export function loadImage(
  src: string,
  errorMessage = 'Failed to load image'
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new WatermarkitError(errorMessage));
    img.src = src;
  });
}
