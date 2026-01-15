/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true, // Add trailing slashes to all routes for compatibility
  output: process.env.NEXT_EXPORT ? 'export' : undefined,
  images: {
    unoptimized: true, // Required for static exports since we can't use Next.js image optimization
    formats: ["image/webp"],
    minimumCacheTTL: 31536000,
    localPatterns: [
      { pathname: "/img/**" },
      { pathname: "/img/lqip/**" },
      { pathname: "/colors/**" },
    ],
    remotePatterns: [
      { protocol: "https", hostname: "cms.colormean.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "static.wixstatic.com", pathname: "/**" },
      { protocol: "https", hostname: "colormean.com", pathname: "/**" },
      { protocol: "https", hostname: "www.colormean.com", pathname: "/**" },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'framer-motion', '@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-tooltip'],
  },
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: "/colors/:hex([0-9a-fA-F]{3,6})-image.webp",
        destination: "/colors/:hex/image.webp",
      },
      {
        source: "/tools/:slug-snapshot.webp",
        destination: "/tools/snapshot.webp?slug=:slug",
      },
      {
        source: "/img/lqip",
        destination: "/img/lqip",
      },
      {
        source: "/img",
        destination: "/img",
      },
    ]
  },
  // Note: Redirects are handled via public/_redirects file for static export compatibility
  // async redirects() {
  //   return [
  //     // 301 redirect from old URL structure to new one for SEO
  //     {
  //       source: '/color/:hex',
  //       destination: '/colors/:hex',
  //       permanent: true,
  //     },
  //   ]
  // },
}

export default nextConfig