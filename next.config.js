/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

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

  // Self-host TinyMCE
  // See: https://iiiyu.com/2022/08/28/self-hosted-tinymce-6-x-in-nextjs-12-x-javascript-version/
  webpack: (config) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.join(__dirname, 'node_modules/tinymce'),
            to: path.join(__dirname, 'public/tinymce'),
          },
        ],
      })
    );
    return config;
  },
};
