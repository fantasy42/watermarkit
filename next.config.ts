import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  reactCompiler: true,
};

export default nextConfig;
