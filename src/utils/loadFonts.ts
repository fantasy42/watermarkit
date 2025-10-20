import type {Font} from 'satori';

// Cache variables to avoid reloading fonts multiple times
let cachedFonts: Font[] | null = null;
let cachedFontsPromise: Promise<Font[]> | null = null;

export async function loadFonts(signal?: AbortSignal): Promise<Font[]> {
  if (cachedFonts) {
    return cachedFonts;
  }
  if (cachedFontsPromise) {
    return cachedFontsPromise;
  }

  cachedFontsPromise = (async () => {
    const init: RequestInit = {signal, cache: 'force-cache'};
    const buffers = await Promise.all(
      fontManifest.map((f) =>
        fetch(f.url, init).then((r) => {
          if (!r.ok) throw new Error(`Failed to load font: ${f.url}`);
          return r.arrayBuffer();
        })
      )
    );
    cachedFonts = fontManifest.map(
      ({url: _url, ...rest}, index) =>
        ({
          ...rest,
          data: buffers[index],
        }) as Font
    );
    return cachedFonts;
  })();

  return cachedFontsPromise;
}

const fontManifest = [
  {name: 'Inter', weight: 300, style: 'normal', url: '/inter-300-normal.ttf'},
  {name: 'Inter', weight: 400, style: 'normal', url: '/inter-400-normal.ttf'},
  {name: 'Inter', weight: 700, style: 'normal', url: '/inter-700-normal.ttf'},
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
  {name: 'Roboto', weight: 300, style: 'normal', url: '/roboto-300-normal.ttf'},
  {name: 'Roboto', weight: 400, style: 'normal', url: '/roboto-400-normal.ttf'},
  {name: 'Roboto', weight: 700, style: 'normal', url: '/roboto-700-normal.ttf'},
];
