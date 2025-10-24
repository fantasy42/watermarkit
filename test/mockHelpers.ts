export function createMockImage(width = 100, height = 100) {
  return {
    width,
    height,
    src: '',
    decoding: 'auto' as const,
    onload: null,
    onerror: null,
  } as unknown as HTMLImageElement;
}

export function createMockFile(name: string, type: string) {
  return new File(['mock-content'], name, {type});
}

export function createMockFileReader(shouldError = false) {
  class MockFileReader {
    static EMPTY = 0;
    static LOADING = 1;
    static DONE = 2;

    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    result = 'data:image/mock;base64,mockdata';

    readAsDataURL = vi
      .fn()
      .mockImplementation(createFileReaderImplementation(shouldError));
  }

  return new MockFileReader();
}

function createFileReaderImplementation(shouldError: boolean) {
  return function (
    this: {onerror: (() => void) | null; onload: (() => void) | null},
    _blob: Blob
  ) {
    setTimeout(() => {
      if (shouldError) {
        this.onerror?.();
      } else {
        this.onload?.();
      }
    }, 0);
  };
}

export function createMockLink() {
  return {
    href: '',
    download: '',
    click: vi.fn(),
    onclick: null as ((event: unknown) => void) | null,
  } as unknown as HTMLAnchorElement;
}

export function setupDOMMocks() {
  const mockCanvas = createMockCanvas();
  const mockLink = createMockLink();

  // Mock document.createElement
  vi.spyOn(document, 'createElement').mockImplementation((tag) => {
    if (tag === 'canvas') {
      return mockCanvas;
    }
    if (tag === 'a') {
      return mockLink;
    }
    return document.createElement(tag);
  });

  // Mock URL methods
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(vi.fn());

  return {mockCanvas, mockLink};
}

function createMockCanvas() {
  const mockContext = {
    clearRect: vi.fn(),
    drawImage: vi.fn(),
  };

  return {
    width: 0,
    height: 0,
    getContext: vi.fn().mockReturnValue(mockContext),
    toBlob: vi
      .fn()
      .mockImplementation((callback) => callback(new Blob(['mock-blob']))),
  } as unknown as HTMLCanvasElement;
}

export function cleanupDOMMocks() {
  vi.restoreAllMocks();
  vi.clearAllMocks();
}
