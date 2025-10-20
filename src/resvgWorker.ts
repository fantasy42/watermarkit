import * as resvg from '@resvg/resvg-wasm';

const wasmPath = new URL('@resvg/resvg-wasm/index_bg.wasm', import.meta.url);
// Preload and initialize the WASM module once
// This ensures the worker is ready before handling any messages
const wasmReady = fetch(wasmPath).then((result) => resvg.initWasm(result));

self.onmessage = async (event) => {
  const {svg, _id} = event.data;

  try {
    // Ensure WASM is fully initialized before rendering
    await wasmReady;

    const renderer = new resvg.Resvg(svg, {
      fitTo: {
        mode: 'original',
      },
      font: {
        loadSystemFonts: false,
      },
      imageRendering: 1,
      shapeRendering: 0,
      textRendering: 0,
    });
    // Render the SVG into a rasterized image
    const image = renderer.render();
    // Convert the rendered image into a PNG buffer
    const pngBuffer = image.asPng();

    // Send the result back to the main thread.
    // Transfer the underlying ArrayBuffer for efficiency.
    self.postMessage({_id, pngBuffer}, [pngBuffer.buffer]);
  } catch (error) {
    self.postMessage({_id, error: (error as Error).message});
  }
};
