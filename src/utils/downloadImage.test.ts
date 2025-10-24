import * as convertImageModule from './convertImage';
import {downloadImage} from './downloadImage';
import {
  createMockLink,
  setupDOMMocks,
  cleanupDOMMocks,
} from '../../test/mockHelpers';
import {expectAsyncError} from '../../test/testHelpers';
import {WatermarkitError} from './error';

describe('downloadImage', () => {
  let mockLink: ReturnType<typeof createMockLink>;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    const domMocks = setupDOMMocks();
    mockLink = domMocks.mockLink;
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanupDOMMocks();
  });

  it('should download PNG image directly without conversion', async () => {
    const svg = '<svg>test</svg>';
    const mockPngUrl = 'blob:png-data';
    const mockRenderPng = vi.fn().mockResolvedValue(mockPngUrl);

    // Start download and wait for onclick to be set
    const downloadPromise = downloadImage(svg, 'test', 'png', mockRenderPng);
    await vi.runAllTimersAsync();

    // Trigger click handler and wait for promise
    if (mockLink.onclick) {
      mockLink.onclick({} as PointerEvent);
    }
    await downloadPromise;

    expect(mockRenderPng).toHaveBeenCalledWith({svg});
    expect(mockLink.href).toBe(mockPngUrl);
    expect(mockLink.download).toBe('Watermarkit_test.png');
    expect(mockLink.click).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockPngUrl);
  });

  it('should convert PNG to JPEG before downloading', async () => {
    const svg = '<svg>test</svg>';
    const mockPngUrl = 'blob:png-data';
    const mockJpegUrl = 'blob:jpeg-data';
    const mockRenderPng = vi.fn().mockResolvedValue(mockPngUrl);

    vi.spyOn(convertImageModule, 'convertImage').mockResolvedValue(mockJpegUrl);

    const downloadPromise = downloadImage(svg, 'test', 'jpeg', mockRenderPng);
    await vi.runAllTimersAsync();

    if (mockLink.onclick) {
      mockLink.onclick({} as PointerEvent);
    }
    await downloadPromise;

    expect(mockRenderPng).toHaveBeenCalledWith({svg});
    expect(convertImageModule.convertImage).toHaveBeenCalledWith(
      mockPngUrl,
      'jpeg'
    );
    expect(mockLink.href).toBe(mockJpegUrl);
    expect(mockLink.download).toBe('Watermarkit_test.jpeg');
    expect(mockLink.click).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockJpegUrl);
  });

  it('should throw error when renderPng fails', async () => {
    const svg = '<svg>test</svg>';
    const mockRenderPng = vi.fn().mockRejectedValue(new Error('Render failed'));

    await expectAsyncError(
      downloadImage(svg, 'test', 'png', mockRenderPng),
      WatermarkitError,
      'Failed to download the image.'
    );

    expect(URL.revokeObjectURL).not.toHaveBeenCalled();
  });

  it('should throw error when conversion fails', async () => {
    const svg = '<svg>test</svg>';
    const mockPngUrl = 'blob:png-data';
    const mockRenderPng = vi.fn().mockResolvedValue(mockPngUrl);

    vi.spyOn(convertImageModule, 'convertImage').mockRejectedValue(
      new Error('Conversion failed')
    );

    await expectAsyncError(
      downloadImage(svg, 'test', 'jpeg', mockRenderPng),
      WatermarkitError,
      'Failed to download the image.'
    );

    expect(URL.revokeObjectURL).not.toHaveBeenCalled();
  });

  it('should ensure URL is revoked after successful download with no errors', async () => {
    const svg = '<svg>test</svg>';
    const mockPngUrl = 'blob:png-data';
    const mockRenderPng = vi.fn().mockResolvedValue(mockPngUrl);

    const downloadPromise = downloadImage(svg, 'test', 'png', mockRenderPng);
    await vi.runAllTimersAsync();

    if (mockLink.onclick) {
      mockLink.onclick({} as PointerEvent);
    }
    await downloadPromise;

    expect(mockRenderPng).toHaveBeenCalledWith({svg});
    expect(mockLink.href).toBe(mockPngUrl);
    expect(mockLink.download).toBe('Watermarkit_test.png');
    expect(mockLink.click).toHaveBeenCalled();

    // Verify URL is properly revoked after successful download
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockPngUrl);
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1);
  });

  it('should ensure URL is revoked even if link click fails', async () => {
    const svg = '<svg>test</svg>';
    const mockPngUrl = 'blob:png-data';
    const mockRenderPng = vi.fn().mockResolvedValue(mockPngUrl);

    // Make the click throw an error
    (mockLink.click as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new Error('Click failed');
    });

    await expectAsyncError(
      downloadImage(svg, 'test', 'png', mockRenderPng),
      WatermarkitError,
      'Failed to download the image.'
    );

    expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockPngUrl);
  });
});
