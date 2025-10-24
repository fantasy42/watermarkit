import {loadImage} from './loadImage';
import {
  createMockImageConstructor,
  expectAsyncError,
} from '../../test/testHelpers';
import {WatermarkitError} from './error';

describe('loadImage', () => {
  beforeEach(() => {
    // @ts-expect-error - Replacing global Image
    global.Image = createMockImageConstructor(false);
  });

  it('should load a valid image successfully', async () => {
    // Create a 1x1 black pixel base64 PNG
    const base64Image =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    const image = await loadImage(base64Image);

    expect(image).toBeDefined();
    expect(image.width).toBe(1);
    expect(image.height).toBe(1);
  });

  it('should reject with error when loading invalid image', async () => {
    const invalidImage = 'data:image/png;base64,invalid';

    await expectAsyncError(
      loadImage(invalidImage),
      WatermarkitError,
      'Failed to load image'
    );
  });

  it('should reject with custom error message', async () => {
    const invalidImage = 'data:image/png;base64,invalid';
    const customError = 'Custom error message';

    await expectAsyncError(
      loadImage(invalidImage, customError),
      WatermarkitError,
      customError
    );
  });

  it('should handle empty src', async () => {
    await expectAsyncError(
      loadImage(''),
      WatermarkitError,
      'Failed to load image'
    );
  });

  it('should handle non-data URLs', async () => {
    const httpImage = 'http://example.com/image.png';

    await expectAsyncError(
      loadImage(httpImage),
      WatermarkitError,
      'Failed to load image'
    );
  });

  it('should set decoding to async', async () => {
    const base64Image =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    const image = await loadImage(base64Image);
    expect(image.decoding).toBe('async');
  });
});
