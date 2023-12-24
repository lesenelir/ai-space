const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    domains: ['img.clerk.com', 'images.clerk.dev'],
  }
}

module.exports = nextConfig
