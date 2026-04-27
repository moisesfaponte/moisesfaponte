/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'tienda.mercadona.es' },
      { hostname: 'www.hiperdino.es' },
      { hostname: 'www.lidl.es' },
    ],
  },
}

export default nextConfig
