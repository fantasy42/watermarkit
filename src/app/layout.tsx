import {Theme} from '@radix-ui/themes';

import '@radix-ui/themes/styles.css';
import '../globals.css';

import type {Metadata, Viewport} from 'next';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Theme asChild radius="none">
          <main>{children}</main>
        </Theme>
      </body>
    </html>
  );
}

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
};

const title =
  'Watermarkit - Free Online Photo Watermark Tool | Protect & Brand Your Images';

export const metadata: Metadata = {
  metadataBase: new URL('https://watermarkit.online'),
  title: {
    template: '%s · Watermarkit',
    default: title,
  },
  twitter: {
    site: '@watermarkit',
    card: 'summary_large_image',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: {
      template: '%s · Watermarkit',
      default: title,
    },
    ttl: 604_800,
  },
  robots: {
    follow: true,
    index: true,
  },
};
