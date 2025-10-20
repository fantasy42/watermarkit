import {WatermarkitError} from './error';

const DOWNLOAD_ERROR_MESSAGE = 'Failed to download the image.';

export async function downloadImage(
  svg: string,
  name: string,
  format: 'png' | 'jpeg' | 'webp' = 'png',
  renderPng: (args: {svg: string}) => Promise<string>
) {
  try {
    const pngUrl = await renderPng({svg});

    let url: string;

    if (format === 'png') {
      // If PNG is requested, we can use the rendered PNG directly
      url = pngUrl;
    } else {
      // Otherwise, convert the PNG into the requested format
      const img = await loadImage(pngUrl);
      const canvas = getSharedCanvas(img.width, img.height);
      const context = canvas.getContext('2d');
      if (!context) {
        throw new WatermarkitError(DOWNLOAD_ERROR_MESSAGE);
      }
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0);

      const blob = await canvasToBlob(canvas, `image/${format}`);
      url = URL.createObjectURL(blob);
    }

    const link = document.createElement('a');
    link.href = url;
    link.download = `Watermarkit_${name}.${format}`;
    link.click();

    // Revoke the object URL on the next frame
    requestAnimationFrame(() => URL.revokeObjectURL(url));
  } catch {
    throw new WatermarkitError(DOWNLOAD_ERROR_MESSAGE);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new WatermarkitError(DOWNLOAD_ERROR_MESSAGE));
    img.src = src;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new WatermarkitError(DOWNLOAD_ERROR_MESSAGE)),
      type,
      quality
    );
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
