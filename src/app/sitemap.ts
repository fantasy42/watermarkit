import type {MetadataRoute} from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.watermarkit.online',
      lastModified: new Date(),
    },
  ];
}
