import {convertImage, blobToBase64} from './convertImage';
import {createMockImage, createMockFileReader} from '../../test/mockHelpers';
import {expectAsyncError} from '../../test/testHelpers';
import {WatermarkitError} from './error';

import type {ImageFormat} from '../types';

const mockContext: {
  clearRect: ReturnType<typeof vi.fn>;
  drawImage: ReturnType<typeof vi.fn>;
} | null = {
  clearRect: vi.fn(),
  drawImage: vi.fn(),
};

const mockCanvas = {
  width: 0,
  height: 0,
  getContext: vi.fn().mockReturnValue(mockContext),
  toBlob: vi
    .fn()
    .mockImplementation((callback) => callback(new Blob(['mock-blob']))),
};

describe('convertImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.document.createElement = vi.fn().mockReturnValue(mockCanvas);
    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
    const MockFileReader = class {
      static EMPTY = 0;
      static LOADING = 1;
      static DONE = 2;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      result = 'data:mock/base64';
      readAsDataURL(_blob: Blob) {
        setTimeout(() => this.onload?.(), 0);
      }
    };
    // @ts-expect-error - Partial mock implementation
    global.FileReader = MockFileReader;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should convert image between different formats', async () => {
    const sourceImage = createMockImage();
    const toPngBlob = vi
      .fn()
      .mockReturnValue(new Blob(['png-data'], {type: 'image/png'}));
    const toWebpBlob = vi
      .fn()
      .mockReturnValue(new Blob(['webp-data'], {type: 'image/webp'}));

    // Test PNG conversion
    mockCanvas.toBlob.mockImplementationOnce((callback) =>
      callback(toPngBlob())
    );
    await convertImage(sourceImage, 'png');
    expect(mockCanvas.toBlob).toHaveBeenLastCalledWith(
      expect.any(Function),
      'image/png',
      expect.any(Number)
    );

    // Test WebP conversion
    mockCanvas.toBlob.mockImplementationOnce((callback) =>
      callback(toWebpBlob())
    );
    await convertImage(sourceImage, 'webp');
    expect(mockCanvas.toBlob).toHaveBeenLastCalledWith(
      expect.any(Function),
      'image/webp',
      expect.any(Number)
    );

    // Verify different blobs were created for different formats
    expect(toPngBlob).toHaveBeenCalled();
    expect(toWebpBlob).toHaveBeenCalled();
  });

  it('should convert image to base64', async () => {
    const sourceImage = createMockImage();
    const format: ImageFormat = 'jpeg';
    const options = {output: 'base64' as const, quality: 0.8};

    mockCanvas.toBlob = vi.fn().mockImplementation((callback) => {
      callback(new Blob(['mock-blob']));
    });

    const result = await convertImage(sourceImage, format, options);

    expect(mockCanvas.toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      'image/jpeg',
      0.8
    );
    expect(result).toBe('data:mock/base64');
  });

  it('should convert image to URL with default options', async () => {
    const sourceImage = createMockImage();
    const format: ImageFormat = 'png';

    mockCanvas.toBlob = vi.fn().mockImplementation((callback) => {
      callback(new Blob(['mock-blob']));
    });

    const result = await convertImage(sourceImage, format);

    expect(mockContext?.clearRect).toHaveBeenCalledWith(0, 0, 100, 100);
    expect(mockContext?.drawImage).toHaveBeenCalledWith(sourceImage, 0, 0);
    expect(mockCanvas.toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      'image/png',
      0.92
    );
    expect(result).toBe('blob:mock-url');
  });

  it('should throw error when canvas context is null', async () => {
    const sourceImage = createMockImage();
    mockCanvas.getContext.mockReturnValueOnce(null);

    await expectAsyncError(
      convertImage(sourceImage, 'png'),
      WatermarkitError,
      'Failed to convert image'
    );
  });

  it('should throw error when toBlob fails', async () => {
    const sourceImage = createMockImage();
    mockCanvas.toBlob = vi.fn().mockImplementation((callback) => {
      callback(null);
    });

    await expectAsyncError(
      convertImage(sourceImage, 'png'),
      WatermarkitError,
      'Failed to convert image'
    );
  });

  it('should reuse canvas instance and maintain its dimensions', async () => {
    const sourceImage = createMockImage();
    const updatedSize = createMockImage(200, 200);

    mockCanvas.toBlob.mockImplementation((callback) =>
      callback(new Blob(['mock-blob']))
    );

    // First conversion should set canvas size to 100x100
    await convertImage(sourceImage, 'png');
    expect(mockCanvas.width).toBe(100);
    expect(mockCanvas.height).toBe(100);

    // Second conversion should update canvas size to 200x200
    await convertImage(updatedSize, 'jpeg');
    expect(mockCanvas.width).toBe(200);
    expect(mockCanvas.height).toBe(200);
  });
});

describe('blobToBase64', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should convert blob to base64 successfully', async () => {
    const mockBlob = new Blob(['test content'], {type: 'image/png'});
    const mockBase64 = 'data:image/png;base64,dGVzdCBjb250ZW50';

    const mockFileReader = createMockFileReader(false);
    (mockFileReader as {result: string}).result = mockBase64;
    // @ts-expect-error - Partial mock implementation
    global.FileReader = class extends mockFileReader.constructor {
      constructor() {
        super();
        (this as unknown as {result: string}).result = mockBase64;
      }
    };

    const result = await blobToBase64(mockBlob);
    expect(result).toBe(mockBase64);
  });

  it('should handle FileReader errors', async () => {
    const mockBlob = new Blob(['test content'], {type: 'image/png'});

    const mockFileReader = createMockFileReader(true);
    // @ts-expect-error - Partial mock implementation
    global.FileReader = class extends mockFileReader.constructor {
      constructor() {
        super();
      }
    };

    await expectAsyncError(
      blobToBase64(mockBlob),
      WatermarkitError,
      'Failed to convert blob to base64'
    );
  });
});
