export class WatermarkitError extends Error {
  constructor(message: string, options?: {cause?: unknown}) {
    super(message, options);
    this.name = 'WatermarkitError';
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
}

export function isWatermarkitError(error: unknown): error is WatermarkitError {
  return error instanceof WatermarkitError;
}

export const UNKNOWN_ERROR = 'Unknown error occurred.';
