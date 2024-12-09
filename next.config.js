/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/klines/:path*',
        destination: 'https://server-mmdev.vest.exchange/v2/klines/:path*',
      },
    ]
  },
}

module.exports = nextConfig 