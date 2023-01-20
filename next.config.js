module.exports = {
  trailingSlash: true,
  images: {
    domains: process.env.NEXT_PUBLIC_IMAGES_DOMAINS?.split(',') || [],
  },
  async redirects() {
    return [
      // At first, nonprofit pages were under `/organizations` folder.
      // It has been decided to shorten the length of the nonprofits' pages.
      // But we need to support the old address pattern for backward compatibility
      {
        source: '/organizations/:path*',
        destination: '/:path*',
        permanent: true,
      },
    ];
  },
};
