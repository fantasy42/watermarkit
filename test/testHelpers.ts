import {WatermarkitError} from '../src/utils/error';

export async function expectAsyncError(
  promise: Promise<unknown>,
  expectedError: new (message: string) => Error = WatermarkitError,
  expectedMessage?: string
) {
  await expect(promise).rejects.toThrow(expectedError);

  if (expectedMessage) {
    await expect(promise).rejects.toThrow(expectedMessage);
  }
}

export function createMockImageConstructor(shouldError = false) {
  return class MockImage {
    width = 1;
    height = 1;
    decoding = 'async';
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    src = '';

    constructor() {
      setTimeout(() => {
        if (
          shouldError ||
          this.src.includes('invalid') ||
          this.src === '' ||
          this.src.startsWith('http')
        ) {
          this.onerror?.();
        } else {
          this.onload?.();
        }
      }, 0);
    }
  };
}
