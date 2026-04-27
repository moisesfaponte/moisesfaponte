/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'tienda.mercadona.es' },
      { hostname: 'www.hiperdino.es' },
      { hostname: 'www.lidl.es' },
    ],
  },
  // Required to import large JSON files in API routes
  experimental: {
    serverComponentsExternalPackages: [],
  },
}

export default nextConfig
