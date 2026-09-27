/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "*.ufs.sh" },
      { protocol: "https", hostname: "uploadthing.com" },
    ],
  },
  // Les requetes catalogue sont mises en cache dans le Data Cache Next.js/Vercel.
};

module.exports = nextConfig;
