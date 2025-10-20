import type {MetadataRoute} from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://watermarkit.online',
      lastModified: new Date(),
    },
  ];
}
