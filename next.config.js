/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    domains: [
      'ph-files.imgix.net', 
      'news.ycombinator.com',
      'images.unsplash.com'
    ],
  },
};

module.exports = nextConfig;