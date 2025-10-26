import {WatermarkitError} from './error';

import type {Font} from 'satori';

// Cache per font key
const fontCache = new Map<string, Promise<Font>>();

export async function loadFont(
  fontOptions: {name: string; weight: number},
  signal: AbortSignal | undefined
): Promise<Font> {
  const fontKey = `${fontOptions.name}-${fontOptions.weight}`;

  if (!fontCache.has(fontKey)) {
    const font = fontManifestMap.get(fontKey);
    if (!font) {
      throw new WatermarkitError('Font not found');
    }

    const promise = fetch(font.url, {cache: 'force-cache', signal})
      .then(async (response) => {
        const buffer = await response.arrayBuffer();
        const {name, style, weight} = font;
        return {
          name,
          style,
          weight,
          data: buffer,
        } as Font;
      })
      .catch(() => {
        fontCache.delete(fontKey);
        throw new WatermarkitError('Failed to load font');
      });

    fontCache.set(fontKey, promise);
  }

  return fontCache.get(fontKey)!;
}

const fontManifest = [
  {name: 'Inter', weight: 300, style: 'normal', url: '/inter-300-normal.ttf'},
  {name: 'Inter', weight: 400, style: 'normal', url: '/inter-400-normal.ttf'},
  {name: 'Inter', weight: 700, style: 'normal', url: '/inter-700-normal.ttf'},
  {name: 'Roboto', weight: 300, style: 'normal', url: '/roboto-300-normal.ttf'},
  {name: 'Roboto', weight: 400, style: 'normal', url: '/roboto-400-normal.ttf'},
  {name: 'Roboto', weight: 700, style: 'normal', url: '/roboto-700-normal.ttf'},
  {
    name: 'Montserrat',
    weight: 300,
    style: 'normal',
    url: '/montserrat-300-normal.ttf',
  },
  {
    name: 'Montserrat',
    weight: 400,
    style: 'normal',
    url: '/montserrat-400-normal.ttf',
  },
  {
    name: 'Montserrat',
    weight: 700,
    style: 'normal',
    url: '/montserrat-700-normal.ttf',
  },
];

const fontManifestMap = new Map(
  fontManifest.map((font) => [`${font.name}-${font.weight}`, font])
);
