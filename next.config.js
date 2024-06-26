/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  trailingSlash: false,
  reactStrictMode: false,
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig
