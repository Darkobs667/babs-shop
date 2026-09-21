/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "*.ufs.sh" },
      { protocol: "https", hostname: "uploadthing.com" },
    ],
  },
  // Les pages catalogue utilisent revalidate; aucune fonction longue n'est requise sur Vercel Hobby.
};

module.exports = nextConfig;
