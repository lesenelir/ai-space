const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.clerk.com' },
      { protocol: 'https', hostname: 'images.clerk.dev' },
      { protocol: 'http', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ]
  }
}

module.exports = nextConfig
