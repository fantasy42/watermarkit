import * as convertImageModule from './convertImage';
import * as loadImageModule from './loadImage';
import {getImageData, getFileFormat} from './getImageData';
import {
  createMockFile,
  createMockImage,
  createMockFileReader,
} from '../../test/mockHelpers';
import {expectAsyncError} from '../../test/testHelpers';
import {WatermarkitError} from './error';

describe('getImageData', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const mockFileReader = createMockFileReader(false);
    // @ts-expect-error - Partial mock implementation
    global.FileReader = class extends mockFileReader.constructor {
      constructor() {
        super();
      }
    };
  });

  it('should process a PNG file correctly', async () => {
    const mockFile = createMockFile('test.png', 'image/png');
    const mockImage = createMockImage(100, 200);

    vi.spyOn(loadImageModule, 'loadImage').mockResolvedValue(mockImage);

    const result = await getImageData(mockFile);

    expect(result).toEqual({
      width: 100,
      height: 200,
      filename: 'test',
      base64: 'data:image/mock;base64,mockdata',
      format: 'png',
    });
    expect(loadImageModule.loadImage).toHaveBeenCalledTimes(1);
  });

  it('should process a JPEG file correctly', async () => {
    const mockFile = createMockFile('photo.jpg', 'image/jpeg');
    const mockImage = createMockImage(300, 400);

    vi.spyOn(loadImageModule, 'loadImage').mockResolvedValue(mockImage);

    const result = await getImageData(mockFile);

    expect(result).toEqual({
      width: 300,
      height: 400,
      filename: 'photo',
      base64: 'data:image/mock;base64,mockdata',
      format: 'jpeg',
    });
    expect(loadImageModule.loadImage).toHaveBeenCalledTimes(1);
  });

  it('should convert WebP to PNG', async () => {
    const mockFile = createMockFile('image.webp', 'image/webp');
    const mockImage = createMockImage(150, 150);
    const convertedBase64 = 'data:image/png;base64,converted';

    vi.spyOn(loadImageModule, 'loadImage').mockResolvedValue(mockImage);
    vi.spyOn(convertImageModule, 'convertImage').mockResolvedValue(
      convertedBase64
    );

    const result = await getImageData(mockFile);

    expect(result).toEqual({
      width: 150,
      height: 150,
      filename: 'image',
      base64: convertedBase64,
      format: 'webp',
    });
    expect(convertImageModule.convertImage).toHaveBeenCalledWith(
      mockImage,
      'png',
      {output: 'base64'}
    );
    expect(loadImageModule.loadImage).toHaveBeenCalledTimes(2);
  });

  it('should convert AVIF to PNG', async () => {
    const mockFile = createMockFile('photo.avif', 'image/avif');
    const mockImage = createMockImage(250, 250);
    const convertedBase64 = 'data:image/png;base64,converted';

    vi.spyOn(loadImageModule, 'loadImage').mockResolvedValue(mockImage);
    vi.spyOn(convertImageModule, 'convertImage').mockResolvedValue(
      convertedBase64
    );

    const result = await getImageData(mockFile);

    expect(result).toEqual({
      width: 250,
      height: 250,
      filename: 'photo',
      base64: convertedBase64,
      format: 'avif',
    });
    expect(convertImageModule.convertImage).toHaveBeenCalledWith(
      mockImage,
      'png',
      {output: 'base64'}
    );
    expect(loadImageModule.loadImage).toHaveBeenCalledTimes(2);
  });

  it('should use PNG as default format for files without extension (with dot)', async () => {
    const mockFile = createMockFile('image.', 'image/png');
    const mockImage = createMockImage(100, 100);

    vi.spyOn(loadImageModule, 'loadImage').mockResolvedValue(mockImage);

    const result = await getImageData(mockFile);

    expect(result).toEqual({
      width: 100,
      height: 100,
      filename: 'image',
      base64: 'data:image/mock;base64,mockdata',
      format: 'png',
    });
    expect(loadImageModule.loadImage).toHaveBeenCalledTimes(1);
  });

  it('should use PNG as default format for files without any dot', async () => {
    const mockFile = createMockFile('imagewithoutextension', 'image/png');
    const mockImage = createMockImage(100, 100);

    vi.spyOn(loadImageModule, 'loadImage').mockResolvedValue(mockImage);

    const result = await getImageData(mockFile);

    expect(result).toEqual({
      width: 100,
      height: 100,
      filename: 'imagewithoutextension',
      base64: 'data:image/mock;base64,mockdata',
      format: 'png',
    });
    expect(loadImageModule.loadImage).toHaveBeenCalledTimes(1);
  });

  it('should handle file reading errors', async () => {
    const mockFile = createMockFile('test.png', 'image/png');
    const mockErrorFileReader = createMockFileReader(true);
    // @ts-expect-error - Partial mock implementation
    global.FileReader = class extends mockErrorFileReader.constructor {
      constructor() {
        super();
      }
    };

    await expectAsyncError(
      getImageData(mockFile),
      WatermarkitError,
      'Failed to read file.'
    );
  });

  it('should handle image loading errors', async () => {
    const mockFile = createMockFile('test.png', 'image/png');
    vi.spyOn(loadImageModule, 'loadImage').mockRejectedValue(
      new WatermarkitError('Failed to load image')
    );

    await expectAsyncError(
      getImageData(mockFile),
      WatermarkitError,
      'Failed to load image'
    );
  });
});

describe('getFileFormat', () => {
  it.each(testFileFormatCases)(
    'should return $expected for filename "$filename"',
    ({filename, expected}) => {
      expect(getFileFormat(filename)).toBe(expected);
    }
  );

  it('should handle edge cases', () => {
    expect(getFileFormat('')).toBe('png');
    expect(getFileFormat('.')).toBe('png');
    expect(getFileFormat('..')).toBe('png');
    expect(getFileFormat('file.')).toBe('png');
    expect(getFileFormat('.hidden')).toBe('hidden'); // .hidden is a valid extension
    expect(getFileFormat('file.backup.old.png')).toBe('png');
  });

  it('should handle unknown extensions', () => {
    expect(getFileFormat('file.xyz')).toBe('xyz');
    expect(getFileFormat('file.UNKNOWN')).toBe('unknown');
  });
});

const testFileFormatCases = [
  {filename: 'image.png', expected: 'png'},
  {filename: 'image.PNG', expected: 'png'},
  {filename: 'image.jpg', expected: 'jpeg'},
  {filename: 'image.JPG', expected: 'jpeg'},
  {filename: 'image.jpeg', expected: 'jpeg'},
  {filename: 'image.webp', expected: 'webp'},
  {filename: 'image.avif', expected: 'avif'},
  {filename: 'image.backup.png', expected: 'png'},
  {filename: 'image.', expected: 'png'},
  {filename: 'imagewithoutextension', expected: 'png'},
  {filename: 'image.unknown', expected: 'unknown'},
];
