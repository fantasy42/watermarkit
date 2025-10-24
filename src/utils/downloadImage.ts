import {convertImage} from './convertImage';
import {WatermarkitError} from './error';

import type {ImageFormat} from '../types';

export async function downloadImage(
  svg: string,
  name: string,
  format: ImageFormat,
  renderPng: (args: {svg: string}) => Promise<string>
) {
  let url: string | null = null;

  try {
    const pngUrl = await renderPng({svg});
    url = format === 'png' ? pngUrl : await convertImage(pngUrl, format);

    const link = document.createElement('a');
    link.href = url;
    link.download = `Watermarkit_${name}.${format}`;

    // Ensure the download starts before cleanup
    await new Promise((resolve) => {
      link.onclick = resolve;
      link.click();
    });
  } catch {
    throw new WatermarkitError(DOWNLOAD_ERROR_MESSAGE);
  } finally {
    // Ensure URL is always revoked
    if (url) {
      URL.revokeObjectURL(url);
    }
  }
}

const DOWNLOAD_ERROR_MESSAGE = 'Failed to download the image.';
