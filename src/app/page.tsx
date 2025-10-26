import * as React from 'react';
import {
  Badge,
  Box,
  Button,
  Container,
  Em,
  Flex,
  Heading,
  Quote,
  Section,
  Text,
} from '@radix-ui/themes';

import * as Accordion from '../components/Accordion';
import {WatermarkEditor} from '../components/WatermarkEditor';
import {ArrowRightIcon} from '../icons/ArrowRightIcon';
import {DropletIcon} from '../icons/DropletIcon';
import {LightningIcon} from '../icons/LightningIcon';
import {PaletteIcon} from '../icons/PaletteIcon';
import {PinIcon} from '../icons/PinIcon';
import {CheckCircleGreenIcon} from '../icons/CheckCircleGreenIcon';

import type {Metadata} from 'next';

export default function Home() {
  return (
    <React.Fragment>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Watermarkit',
            url: 'https://www.watermarkit.online',
          }),
        }}
      />

      <Container size="4" px="4" overflow="hidden">
        <Flex
          asChild
          justify={{initial: 'start', sm: 'center'}}
          align={{initial: 'stretch', sm: 'center'}}
        >
          <Section
            className="HomeDotsSection"
            size="1"
            height={{initial: '520px', sm: '550px', md: '680px'}}
            px="4"
            mt="4"
          >
            <Flex direction="column" align={{initial: 'stretch', sm: 'center'}}>
              <Flex
                className="HomeIconBox"
                width={{initial: '3rem', md: '5rem'}}
                height={{initial: '3rem', md: '5rem'}}
                align="center"
                justify="center"
              >
                <Box
                  asChild
                  width={{initial: '32px', md: '48px'}}
                  height={{initial: '32px', md: '48px'}}
                >
                  <DropletIcon aria-hidden />
                </Box>
              </Flex>

              <Heading
                size={{initial: '8', md: '9'}}
                align={{initial: 'left', sm: 'center'}}
                weight="medium"
                mb={{initial: '2', md: '0'}}
                mt="2"
              >
                {`Watermark Photos in `}
                <Em>One Click</Em>
              </Heading>
              <Box
                maxWidth={{initial: '500px', md: '600px'}}
                mb={{initial: '4', md: '6'}}
              >
                <Text
                  as="p"
                  size={{initial: '3', md: '5'}}
                  align={{initial: 'left', sm: 'center'}}
                  color="gray"
                >
                  Protect your images with professional watermarks in seconds.
                  Enterprise-grade quality with simple controls.
                </Text>
              </Box>

              <Button
                asChild
                size={{initial: '2', md: '3'}}
                variant="classic"
                radius="small"
              >
                <a href="#watermark-editor">
                  Get Started <ArrowRightIcon aria-hidden />
                </a>
              </Button>
            </Flex>

            <Flex
              className="HomePaperSheet"
              position="absolute"
              width={{initial: '120px', sm: '140px', md: '170px'}}
              height={{initial: 'auto', sm: '150px', md: '190px'}}
              minHeight={{initial: '110px', sm: 'auto'}}
              left={{initial: '1', sm: '3', md: '6'}}
              top={{initial: '330px', sm: '4', md: '7'}}
              p={{initial: '2', md: '3'}}
            >
              <Box
                asChild
                position="absolute"
                width="20px"
                height="20px"
                left="50%"
                top="-12.5px"
                style={{
                  transform:
                    'translateX(-50%) rotate(var(--paper-sheet-rotation))',
                }}
              >
                <PinIcon />
              </Box>

              <Text size={{initial: '1', md: '2'}}>
                <Quote>
                  Keep your images safe from unauthorized use with watermarks.
                </Quote>
              </Text>

              <Flex
                className="HomeIconBox"
                position="absolute"
                width={{initial: '1.75rem', sm: '3rem', md: '4rem'}}
                height={{initial: '1.75rem', sm: '3rem', md: '4rem'}}
                left={{initial: '20%', sm: '0%'}}
                bottom={{initial: '-20%', sm: '-10%'}}
                align="center"
                justify="center"
                style={{
                  transform: 'rotate(calc(0deg - var(--paper-sheet-rotation)))',
                  zIndex: 1,
                }}
              >
                <Box
                  asChild
                  width={{initial: '18px', sm: '32px', md: '46px'}}
                  height={{initial: '18px', sm: '32px', md: '46px'}}
                >
                  <CheckCircleGreenIcon />
                </Box>
              </Flex>

              <Box
                className="HomeBlurOverlay"
                position="absolute"
                width={{initial: '75px', md: '145px'}}
                height={{initial: '80px', md: '150px'}}
                top={{initial: '80%', md: '60%'}}
                left={{
                  initial: 'calc(0px - (var(--width) / 3))',
                  md: 'calc(0px - (var(--width-md) / 2))',
                }}
                style={{
                  transform: 'rotate(16deg)',
                }}
              />
            </Flex>

            <Flex
              className="HomeFolder HomeExportFolder"
              position="absolute"
              display={{initial: 'none', sm: 'flex'}}
              width={{initial: '250px', md: '300px'}}
              height={{initial: '130px', md: '150px'}}
              right={{initial: '-100px', md: '-125px'}}
              top="9"
            >
              <Flex direction="column" width="100%" height="100%" p="3">
                <Flex direction="column" flexGrow="1">
                  <Heading
                    as="h3"
                    size={{initial: '2', md: '3'}}
                    weight="medium"
                  >
                    High Quality Export
                  </Heading>
                  <Text as="p" size={{initial: '1', md: '2'}}>
                    Download your watermarked images in full resolution without
                    quality loss.
                  </Text>
                </Flex>

                <Flex direction="column" aria-hidden>
                  <Button size="1" tabIndex={-1}>
                    Export
                  </Button>
                </Flex>
              </Flex>
            </Flex>

            <Flex
              className="HomeFolder"
              position="absolute"
              display={{initial: 'none', sm: 'flex'}}
              width="250px"
              height="auto"
              left={{sm: '3%', md: '10%'}}
              bottom="7"
            >
              <Flex direction="column" width="100%" height="100%" p="3">
                <Heading as="h3" size="2" weight="medium">
                  Join thousands of creators
                </Heading>
                <Flex direction="column" gap="1" mt="1">
                  <Badge size="2" variant="soft" radius="large" color="purple">
                    50K+ Users
                  </Badge>
                  <Badge size="2" variant="soft" radius="large" color="green">
                    1M+ Images Protected
                  </Badge>
                  <Badge size="2" variant="soft" radius="large" color="orange">
                    99.9% Satisfaction Rate
                  </Badge>
                </Flex>
              </Flex>
            </Flex>

            <Flex
              className="HomeBrowser"
              direction="column"
              position="absolute"
              overflow="hidden"
              width="250px"
              height={{initial: '200px', md: '280px'}}
              bottom={{
                initial: 'calc(0px - var(--height) / 4)',
                md: 'calc(0px - var(--height-md) / 3)',
              }}
              right={{initial: '-25px', sm: '30px', md: '90px'}}
            >
              <Flex px={{initial: '2', md: '3'}} py={{initial: '1', md: '2'}}>
                <Flex
                  flexGrow="1"
                  flexShrink="0"
                  flexBasis="50px"
                  minWidth="0"
                  maxWidth="50px"
                  justify="start"
                  align="center"
                  gap="1"
                >
                  <Box
                    width="var(--space-2)"
                    height="var(--space-2)"
                    flexShrink="0"
                    style={{
                      borderRadius: 9999,
                      backgroundColor: 'var(--red-9)',
                    }}
                  />
                  <Box
                    width="var(--space-2)"
                    height="var(--space-2)"
                    flexShrink="0"
                    style={{
                      borderRadius: 9999,
                      backgroundColor: 'var(--yellow-9)',
                    }}
                  />
                  <Box
                    width="var(--space-2)"
                    height="var(--space-2)"
                    flexShrink="0"
                    style={{
                      borderRadius: 9999,
                      backgroundColor: 'var(--green-9)',
                    }}
                  />
                </Flex>

                <Flex flexGrow="1" justify="center" align="center">
                  <Flex
                    browser-url=""
                    align="center"
                    justify="center"
                    py={{initial: '0', md: '1'}}
                    px={{initial: '2', md: '3'}}
                  >
                    <Text size="1" truncate align="center">
                      watermarkit.online
                    </Text>
                  </Flex>
                </Flex>

                <Flex
                  flexGrow="1"
                  flexShrink="0"
                  flexBasis="50px"
                  minWidth="0"
                  maxWidth="50px"
                />
              </Flex>

              <Flex
                direction="column"
                flexGrow="1"
                p={{initial: '2', md: '3'}}
                style={{backgroundColor: 'var(--gray-2)'}}
              >
                <Box width="100%" height="100%">
                  <Flex direction="column" gap={{initial: '1', md: '2'}}>
                    {[
                      {
                        title: 'Lightning Fast',
                        text: 'Add watermarks to your photos in seconds with our intuitive interface.',
                        Icon: <LightningIcon style={{marginTop: 2}} />,
                      },
                      {
                        title: 'Fully Customizable',
                        text: 'Control opacity, position, size, and style to match your brand perfectly.',
                        Icon: <PaletteIcon />,
                      },
                    ].map(({Icon, title, text}) => (
                      <Flex
                        key={title}
                        browser-item=""
                        align="center"
                        px={{initial: '1', md: '2'}}
                        py="1"
                      >
                        <Flex direction="column" gap={{initial: '0', md: '1'}}>
                          <Flex align="center" gap={{initial: '1', md: '2'}}>
                            <Heading
                              as="h3"
                              size={{initial: '1', md: '2'}}
                              weight="medium"
                            >
                              {title}
                            </Heading>
                            <Flex
                              flexShrink="0"
                              height={{initial: '16px', md: '18px'}}
                              align="center"
                              justify="center"
                            >
                              <Box
                                asChild
                                width="14px"
                                height="14px"
                                aria-hidden
                              >
                                {Icon}
                              </Box>
                            </Flex>
                          </Flex>
                          <Text as="p" size="1">
                            {text}
                          </Text>
                        </Flex>
                      </Flex>
                    ))}
                  </Flex>
                </Box>
              </Flex>
            </Flex>
          </Section>
        </Flex>

        <Section
          id="watermark-editor"
          className="HomeGeneratorSection"
          position="relative"
          mt="9"
          py="0"
        >
          <Flex
            position="relative"
            height="150px"
            align="center"
            justify="center"
            px="4"
            style={{borderBottom: '1px solid var(--generator-border-color)'}}
          >
            <Flex
              direction={{initial: 'column', md: 'row'}}
              align="center"
              gap={{initial: '1', md: '3'}}
            >
              <Heading
                as="h2"
                size={{initial: '6', sm: '7'}}
                align="center"
                weight="medium"
              >
                See the Results Yourself
              </Heading>
              <Text as="p" align="center" color="gray" wrap="balance">
                Upload your image and add a watermark in seconds.
              </Text>
            </Flex>

            <Box
              className="HomeGeneratorDot"
              position="absolute"
              width="var(--size)"
              height="var(--size)"
              top="var(--minus-half-size)"
              left="var(--minus-half-size)"
            />
            <Box
              className="HomeGeneratorDot"
              position="absolute"
              width="var(--size)"
              height="var(--size)"
              top="var(--minus-half-size)"
              right="var(--minus-half-size)"
            />
            <Box
              className="HomeGeneratorDot"
              position="absolute"
              width="var(--size)"
              height="var(--size)"
              bottom="var(--minus-half-size)"
              left="var(--minus-half-size)"
            />
            <Box
              className="HomeGeneratorDot"
              position="absolute"
              width="var(--size)"
              height="var(--size)"
              bottom="var(--minus-half-size)"
              right="var(--minus-half-size)"
            />
          </Flex>

          <Box position="relative" p={{initial: '4', md: '6'}}>
            <WatermarkEditor />

            <Box
              className="HomeGeneratorDot"
              position="absolute"
              width="var(--size)"
              height="var(--size)"
              bottom="var(--minus-half-size)"
              left="var(--minus-half-size)"
            />
            <Box
              className="HomeGeneratorDot"
              position="absolute"
              width="var(--size)"
              height="var(--size)"
              bottom="var(--minus-half-size)"
              right="var(--minus-half-size)"
            />
          </Box>
        </Section>

        <Section size="4">
          <Heading
            as="h2"
            size={{initial: '6', sm: '8'}}
            align="center"
            weight="medium"
            wrap="balance"
            mb={{initial: '6', sm: '8'}}
          >
            Frequently Asked Questions
          </Heading>

          <Box maxWidth="800px" mx="auto">
            <Accordion.Root>
              {[
                {
                  title: 'What is Watermarkit?',
                  text: 'Watermarkit is a free online tool that lets you add custom watermarks to your photos instantly. It helps protect your images from unauthorized use by overlaying text in just one click.',
                },
                {
                  title: 'Do I need to install any software?',
                  text: 'No installation is required. Watermarkit works directly in your browser—fast, secure, and hassle-free.',
                },
                {
                  title: 'Do I need an account to use Watermarkit?',
                  text: 'No account or sign-up is required. Just upload, watermark, and download—simple and fast.',
                },
                {
                  title: 'Is Watermarkit really free to use?',
                  text: 'Yes. Your photos remain private and secure. The project is also open source, meaning the code is publicly available for anyone to review, verify, and contribute to.',
                },
                {
                  title: 'Will my photos be safe?',
                  text: 'Absolutely. Your images are processed securely, and we don’t store or share them. Once you download your watermarked photo, it’s yours alone.',
                },
                {
                  title: 'What image formats are supported?',
                  text: 'Watermarkit supports popular formats including PNG, JPEG, WebP and AVIF. More formats may be added in the future.',
                },
                {
                  title: 'Will the watermark affect my photo quality?',
                  text: 'No. Watermarkit preserves the original resolution and quality of your images while adding your chosen watermark.',
                },
              ].map(({title, text}) => (
                <Accordion.Item key={title}>
                  <Accordion.Trigger>{title}</Accordion.Trigger>
                  <Accordion.Panel>{text}</Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </Box>
        </Section>
      </Container>
    </React.Fragment>
  );
}

const description =
  'Protect your images instantly with Watermarkit. Add custom watermarks to photos online in one click—fast, free, and secure image protection made simple.';

export const metadata: Metadata = {
  description,
  twitter: {
    description,
  },
  openGraph: {
    description,
  },
};
