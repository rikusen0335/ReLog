/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "pbs.twimg.com" },
    ],
  },
  async rewrites() {
    if (!process.env.EMDASH_URL) return [];
    const origin = new URL(process.env.EMDASH_URL).origin;
    return [
      { source: "/_emdash/:path*", destination: origin + "/_emdash/:path*" },
      { source: "/_astro/:path*", destination: origin + "/_astro/:path*" },
    ];
  },
};

module.exports = nextConfig;
