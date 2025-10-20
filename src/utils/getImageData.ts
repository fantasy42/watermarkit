import {WatermarkitError} from './error';

export interface ImageData {
  width: number;
  height: number;
  filename: string;
  base64: string;
}

export async function getImageData(file: File): Promise<ImageData> {
  const base64 = await fileToBase64(file);
  const {width, height} = await loadImage(base64);

  return {
    width,
    height,
    filename: file.name.replace(/\.[^/.]+$/, ''),
    base64,
  };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new WatermarkitError('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<{width: number; height: number}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({width: img.width, height: img.height});
    img.onerror = () => reject(new WatermarkitError('Failed to load image.'));
    img.src = src;
  });
}
