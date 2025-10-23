'use client';
import * as React from 'react';
import satori from 'satori';
import {
  Box,
  Button,
  Callout,
  Flex,
  Grid,
  RadioCards,
  ScrollArea,
  Select,
  Skeleton,
  Slider,
  Spinner,
  Text,
  TextField,
  Theme,
} from '@radix-ui/themes';

import * as Dropzone from './Dropzone';
import * as Field from './Field';
import {ColorField} from './ColorField';
import {useResvgWorker} from '../utils/useResvgWorker';
import {useAbortableEffect} from '../utils/useAbortableEffect';
import {useDebouncedState} from '../utils/useDebouncedState';
import {downloadImage} from '../utils/downloadImage';
import {loadFonts} from '../utils/loadFonts';
import {getImageData} from '../utils/getImageData';
import {createFixedArray} from '../utils/createFixedArray';
import {
  isWatermarkitError,
  UNKNOWN_ERROR,
  WatermarkitError,
} from '../utils/error';
import {UploadIcon} from '../icons/UploadIcon';
import {ImageIcon} from '../icons/ImageIcon';
import {CrossIcon} from '../icons/CrossIcon';
import {ExclamationTriangleIcon} from '../icons/ExclamationTriangle';
import {IMAGE_MIME_TYPE, MAX_PIXELS, MAX_SIZE} from '../constants';

import type {ImageData} from '../utils/getImageData';

export function WatermarkEditor() {
  const [type, setType] = React.useState<WatermarkType>('corner');
  const [svg, setSvg] = React.useState<string>();
  const [src, setSrc] = React.useState<string>();
  const [metadata, setMetadata] = React.useState<ImageMetadata>();
  const [exportFormat, setExportFormat] =
    React.useState<ExportFormat>('original');
  const [isDownloading, setIsDownloading] = React.useState<boolean>(false);
  const [isSvgLoading, setIsSvgLoading] = React.useState<boolean>(false);

  const [text, setText] = useDebouncedState('@fantasy42');
  const [opacity, setOpacity] = useDebouncedState([0.5]);
  const [color, setColor] = useDebouncedState('#FFFFFF');
  const [scale, setScale] = useDebouncedState([0.1]);
  const [fontWeight, setFontWeight] = React.useState<FontWeight>('bold');
  const [fontFamily, setFontFamily] = React.useState<FontFamily>('inter');

  const [error, setError] = React.useState<string>();

  const renderPNG = useResvgWorker();

  const handleTypeChange = React.useCallback(
    (value: WatermarkType) => setType(value),
    [setType]
  );
  const handleTextChange = React.useCallback(
    (value: string) => setText(value),
    [setText]
  );
  const handleScaleChange = React.useCallback(
    (value: number[]) => setScale(value),
    [setScale]
  );
  const handleOpacityChange = React.useCallback(
    (value: number[]) => setOpacity(value),
    [setOpacity]
  );
  const handleColorChange = React.useCallback(
    (value: string) => setColor(value),
    [setColor]
  );
  const handleFontWeightChange = React.useCallback(
    (value: FontWeight) => setFontWeight(value),
    [setFontWeight]
  );
  const handleFontFamily = React.useCallback(
    (value: FontFamily) => setFontFamily(value),
    [setFontFamily]
  );
  const handleExportFormatChange = React.useCallback(
    (value: ExportFormat) => setExportFormat(value),
    [setExportFormat]
  );

  const fontWeightStyle = React.useMemo(() => {
    return fontWeight === 'regular' ? 400 : fontWeight === 'bold' ? 700 : 300;
  }, [fontWeight]);

  const fontSize = React.useMemo(() => {
    if (!metadata) {
      return 0;
    }
    return Math.min(metadata.width, metadata.height) * scale[0];
  }, [metadata, scale]);

  useAbortableEffect(
    (signal) => {
      if (!src) {
        return;
      }

      async function generateSvg() {
        setError(undefined);
        setIsSvgLoading(true);

        try {
          const fonts = await loadFonts(signal);
          if (signal.aborted || !metadata) {
            return;
          }
          const {width, height} = metadata;

          const watermark =
            type === 'corner' ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                  position: 'absolute',
                  inset: 0,
                  width,
                  height,
                  padding: '1.5rem',
                }}
              >
                <div
                  style={{
                    opacity: opacity[0],
                  }}
                >
                  {text}
                </div>
              </div>
            ) : type === 'center' ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  inset: 0,
                  width,
                  height,
                }}
              >
                <div
                  style={{
                    opacity: opacity[0],
                  }}
                >
                  {text}
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'absolute',
                  inset: 0,
                  width,
                  height,
                  overflow: 'hidden',
                }}
              >
                {createFixedArray(4).map((index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      flexWrap: 'nowrap',
                      alignItems: 'center',
                      width: '200%',
                      position: 'absolute',
                      top: `${(index + 0.5) * (100 / 4)}%`,
                      left: '-50%',
                      transform: 'translateY(-50%) rotate(-30deg)',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      opacity: opacity[0],
                    }}
                  >
                    {text.repeat(6)}
                  </div>
                ))}
              </div>
            );

          const svg = await satori(
            <div
              style={{
                position: 'relative',
                display: 'flex',
                width: '100%',
                height: '100%',
                fontFamily,
                fontWeight: fontWeightStyle,
                fontSize,
                color,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
              <img
                src={src}
                width={width}
                height={height}
                style={{objectFit: 'contain'}}
              />

              {watermark}
            </div>,
            {
              width,
              height,
              fonts,
            }
          );

          if (!signal.aborted) {
            setSvg(svg);
          }
        } catch (error) {
          if ((error as Error).name === 'AbortError') {
            return; // Ignore if fetch was aborted
          }
          setError(UNKNOWN_ERROR);
        } finally {
          setIsSvgLoading(false);
        }
      }

      generateSvg();
    },
    [
      src,
      metadata,
      opacity,
      text,
      color,
      scale,
      type,
      fontSize,
      fontFamily,
      fontWeight,
      fontWeightStyle,
    ]
  );

  return (
    <Grid height="100%" width="100%" columns={{initial: '1', md: '2'}} gap="4">
      <Flex direction="column">
        <Box
          position="relative"
          width="100%"
          pb={{initial: '110%', xs: `47.5%`, md: '100%'}}
        >
          <Box position="absolute" inset="0">
            <Dropzone.Root
              className="WatermarkEditorDropzone"
              width="100%"
              height="100%"
              multiple={false}
              maxSize={MAX_SIZE}
              accept={IMAGE_MIME_TYPE}
              disabled={isDownloading}
              loading={isSvgLoading}
              onDrop={async (files) => {
                const file = files[0];
                if (!file) {
                  return;
                }

                setError(undefined);

                try {
                  const {base64, ...metadata} = await getImageData(file);

                  // Reject images that are too big (2500^2).
                  if (metadata.width * metadata.height > MAX_PIXELS) {
                    throw new WatermarkitError(
                      `Image exceeds maximum size of ${Math.sqrt(MAX_PIXELS)}x${Math.sqrt(MAX_PIXELS)} pixels.`
                    );
                  }

                  setSrc(base64);
                  setMetadata(metadata);
                } catch (error) {
                  if (isWatermarkitError(error)) {
                    setError(error.message);
                  } else {
                    setError(UNKNOWN_ERROR);
                  }
                }
              }}
              onReject={(files) => {
                setError(undefined);

                const hasTooManyFiles = files.some((file) =>
                  file.errors.find((error) => error.code === 'too-many-files')
                );
                if (hasTooManyFiles) {
                  setError('You can only upload one file at a time.');
                  return;
                }

                const rejectionErrors = files.flatMap(({file, errors}) =>
                  errors.map((error) => {
                    switch (error.code) {
                      case 'file-too-large': {
                        return `«${file.name}» is too big. The file must not exceed 10 MB.`;
                      }
                      case 'file-invalid-type': {
                        return `«${file.name}» has an unsupported format. PNG, JPEG, WEBP, AVIF are supported.`;
                      }
                      default: {
                        return `«${file.name}» - ${error.message}`;
                      }
                    }
                  })
                );

                setError(rejectionErrors[0]);
              }}
            >
              <Flex
                height="100%"
                direction="column"
                align="center"
                justify="center"
              >
                <Flex direction="column" align="center" gap="4">
                  <Dropzone.Accept>
                    <Box asChild width="52px" height="52px">
                      <UploadIcon style={{color: 'var(--accent-a11)'}} />
                    </Box>
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <Box asChild width="52px" height="52px">
                      <CrossIcon style={{color: 'var(--red-a11)'}} />
                    </Box>
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <Box asChild width="52px" height="52px">
                      <ImageIcon />
                    </Box>
                  </Dropzone.Idle>

                  <Flex direction="column">
                    <Text size={{initial: '3', sm: '4'}} align="center">
                      Drag image here or click to select files
                    </Text>
                    <Text
                      size={{initial: '2', sm: '3'}}
                      color="gray"
                      align="center"
                      wrap="balance"
                    >
                      The file must not exceed 10 MB.
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Dropzone.Root>

            <PreviewRenderer svg={svg} />

            {isSvgLoading && (
              <Flex
                position="absolute"
                direction="column"
                align="center"
                justify="center"
                overflow="hidden"
                inset="1px"
              >
                <Flex
                  position="absolute"
                  width="100%"
                  height="100%"
                  style={{
                    backgroundColor: 'var(--color-panel-translucent)',
                  }}
                />
                <Spinner size="3" />
              </Flex>
            )}
          </Box>
        </Box>
      </Flex>
      <Theme asChild radius="medium">
        <Flex direction="column" gap="3">
          {error && (
            <Callout.Root color="red">
              <Callout.Icon>
                <ExclamationTriangleIcon width={15} height={15} />
              </Callout.Icon>
              <Callout.Text>{error}</Callout.Text>
            </Callout.Root>
          )}

          <TypeControl value={type} onChange={handleTypeChange} />
          <TextControl value={text} onChange={handleTextChange} />

          <Flex gap="3">
            <FontWeightControl
              value={fontWeight}
              onChange={handleFontWeightChange}
            />

            <FontFamilyControl value={fontFamily} onChange={handleFontFamily} />
          </Flex>

          <ScaleControl value={scale} onChange={handleScaleChange} />
          <OpacityControl value={opacity} onChange={handleOpacityChange} />
          <ColorControl value={color} onChange={handleColorChange} />

          <Flex justify="end" gap="3">
            <ExportFormatControl
              value={exportFormat}
              onChange={handleExportFormatChange}
            />

            <DownloadButton
              svg={svg}
              exportFormat={exportFormat}
              metadata={metadata}
              renderPNG={renderPNG}
              isDownloading={isDownloading}
              setError={setError}
              setIsDownloading={setIsDownloading}
            />
          </Flex>
        </Flex>
      </Theme>
    </Grid>
  );
}

const TypeControl = React.memo(function TypeControl({
  value,
  onChange,
}: {
  value: WatermarkType;
  onChange: (value: WatermarkType) => void;
}) {
  return (
    <Box>
      <ScrollArea scrollbars="horizontal">
        <RadioCards.Root
          value={value}
          aria-label="Watermark type"
          onValueChange={onChange}
          style={{display: 'flex'}}
        >
          <RadioCards.Item
            value="corner"
            aria-label="Corner"
            style={{width: '100%'}}
          >
            <Flex
              direction="column"
              width="133px"
              height="64px"
              justify="end"
              align="end"
              p="2"
              style={{
                boxShadow: 'var(--shadow-1)',
                borderRadius: 'inherit',
              }}
            >
              <Text size="1">
                <Skeleton className="WatermarkEditorSkeleton">
                  Watermark
                </Skeleton>
              </Text>
            </Flex>
          </RadioCards.Item>
          <RadioCards.Item
            value="center"
            aria-label="Center"
            style={{width: '100%'}}
          >
            <Flex
              direction="column"
              width="133px"
              height="64px"
              justify="center"
              align="center"
              p="2"
              style={{
                boxShadow: 'var(--shadow-1)',
                borderRadius: 'inherit',
              }}
            >
              <Text size="5">
                <Skeleton className="WatermarkEditorSkeleton">
                  Watermark
                </Skeleton>
              </Text>
            </Flex>
          </RadioCards.Item>
          <RadioCards.Item
            value="crossed"
            aria-label="Crossed"
            style={{width: '100%'}}
          >
            <Flex
              direction="column"
              width="133px"
              height="64px"
              p="2"
              overflow="hidden"
              position="relative"
              style={{
                boxShadow: 'var(--base-card-surface-box-shadow)',
                borderRadius: 'inherit',
              }}
            >
              <Skeleton
                className="WatermarkEditorSkeleton"
                height="8px"
                width="200%"
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%) rotate(-30deg)',
                  left: 'calc(-100% - calc(8px * 4))',
                }}
              />

              <Skeleton
                className="WatermarkEditorSkeleton"
                height="8px"
                width="200%"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '-100%',
                  transform: 'translateY(-50%) rotate(-30deg)',
                }}
              />

              {createFixedArray(5).map((index) => (
                <Skeleton
                  className="WatermarkEditorSkeleton"
                  key={index}
                  height="8px"
                  width="200%"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%) rotate(-30deg)',
                    left: `calc(-100% + (8px * ${(index + 1) * 4}))`,
                  }}
                />
              ))}
            </Flex>
          </RadioCards.Item>
        </RadioCards.Root>
      </ScrollArea>
    </Box>
  );
});

const PreviewRenderer = React.memo(function PreviewRenderer({
  svg,
}: {
  svg: string | undefined;
}) {
  if (!svg) {
    return null;
  }

  return (
    <Box
      className="WatermarkEditorSvgContainer"
      position="absolute"
      inset="1px"
      overflow="hidden"
      style={{
        pointerEvents: 'none',
        backgroundColor: 'var(--color-background)',
      }}
      dangerouslySetInnerHTML={{__html: svg}}
    />
  );
});

const TextControl = React.memo(function TextControl({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field.Root>
      <Field.Label htmlFor="text">Text</Field.Label>
      <Field.Control>
        <TextField.Root
          id="text"
          placeholder="Enter desired watermark"
          aria-label="Text"
          defaultValue={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </Field.Control>
    </Field.Root>
  );
});

const FontWeightControl = React.memo(function FontWeightControl({
  value,
  onChange,
}: {
  value: FontWeight;
  onChange: (value: FontWeight) => void;
}) {
  return (
    <Field.Root width="100%">
      <Field.Label as="span">Font weight</Field.Label>
      <Field.Control>
        <Select.Root value={value} onValueChange={onChange}>
          <Select.Trigger aria-label="Font weight">
            {fontWeightData[value]}
          </Select.Trigger>
          <Select.Content>
            {Object.keys(fontWeightData).map((fontWeight) => (
              <Select.Item key={fontWeight} value={fontWeight}>
                {fontWeightData[fontWeight as FontWeight]}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Field.Control>
    </Field.Root>
  );
});

const FontFamilyControl = React.memo(function FontFamilyControl({
  value,
  onChange,
}: {
  value: FontFamily;
  onChange: (value: FontFamily) => void;
}) {
  return (
    <Field.Root width="100%">
      <Field.Label as="span">Font family</Field.Label>
      <Field.Control>
        <Select.Root value={value} onValueChange={onChange}>
          <Select.Trigger aria-label="Font family">
            {fontFamilyData[value]}
          </Select.Trigger>
          <Select.Content>
            {Object.keys(fontFamilyData).map((fontFamily) => (
              <Select.Item key={fontFamily} value={fontFamily}>
                {fontFamilyData[fontFamily as FontFamily]}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Field.Control>
    </Field.Root>
  );
});

const ScaleControl = React.memo(function ScaleControl({
  value,
  onChange,
}: {
  value: number[];
  onChange: (value: number[]) => void;
}) {
  return (
    <Field.Root>
      <Field.Label as="span">Scale</Field.Label>
      <Field.Control>
        <Slider
          min={0.05}
          max={0.2}
          step={0.05}
          defaultValue={value}
          onValueChange={onChange}
        />
      </Field.Control>
    </Field.Root>
  );
});

const OpacityControl = React.memo(function OpacityControl({
  value,
  onChange,
}: {
  value: number[];
  onChange: (value: number[]) => void;
}) {
  return (
    <Field.Root>
      <Field.Label as="span">Opacity</Field.Label>
      <Field.Control>
        <Slider
          min={0}
          max={1}
          step={0.1}
          defaultValue={value}
          onValueChange={onChange}
        />
      </Field.Control>
    </Field.Root>
  );
});

const ColorControl = React.memo(function ColorControl({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field.Root>
      <Field.Label htmlFor="color">Color</Field.Label>
      <Field.Control>
        <ColorField id="color" value={value} onValueChange={onChange} />
      </Field.Control>
    </Field.Root>
  );
});

const ExportFormatControl = React.memo(function ExportFormatControl({
  value,
  onChange,
}: {
  value: ExportFormat;
  onChange: (value: ExportFormat) => void;
}) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger aria-label="Export format">
        {exportFormatData[value]}
      </Select.Trigger>
      <Select.Content>
        {Object.keys(exportFormatData).map((format) => (
          <Select.Item key={format} value={format}>
            {exportFormatData[format as ExportFormat]}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
});

const DownloadButton = React.memo(function DownloadButton({
  svg,
  metadata,
  exportFormat,
  isDownloading,
  setError,
  setIsDownloading,
  renderPNG,
}: {
  svg: string | undefined;
  metadata: ImageMetadata | undefined;
  exportFormat: ExportFormat;
  isDownloading: boolean;
  renderPNG: (args: {svg: string}) => Promise<string>;
  setIsDownloading: (downloading: boolean) => void;
  setError: (value: string) => void;
}) {
  const handleClick = React.useCallback(async () => {
    if (!svg || !metadata || isDownloading) {
      return;
    }
    setIsDownloading(true);

    try {
      const format =
        exportFormat === 'original' ? metadata.format : exportFormat;
      await downloadImage(svg, metadata.filename, format, renderPNG);
    } catch (error) {
      if (isWatermarkitError(error)) {
        setError(error.message);
      } else {
        setError(UNKNOWN_ERROR);
      }
    } finally {
      setIsDownloading(false);
    }
  }, [
    svg,
    metadata,
    isDownloading,
    setIsDownloading,
    exportFormat,
    renderPNG,
    setError,
  ]);

  return (
    <Button disabled={!svg || isDownloading} onClick={handleClick}>
      <Spinner loading={isDownloading} />
      Download Image
    </Button>
  );
});

type WatermarkType = 'center' | 'corner' | 'crossed';

type FontWeight = keyof typeof fontWeightData;
const fontWeightData = {
  light: 'Light',
  regular: 'Regular',
  bold: 'Bold',
};

type FontFamily = keyof typeof fontFamilyData;
const fontFamilyData = {
  inter: 'Inter',
  roboto: 'Roboto',
  montserrat: 'Montserrat',
};

type ExportFormat = keyof typeof exportFormatData;
const exportFormatData = {
  original: 'Original format',
  png: 'PNG',
  jpeg: 'JPEG',
  webp: 'WebP',
  avif: 'AVIF',
};

interface ImageMetadata extends Omit<ImageData, 'base64'> {}
