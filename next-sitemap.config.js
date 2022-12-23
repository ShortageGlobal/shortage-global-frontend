const ROOT_URL = process.env.NEXT_PUBLIC_ROOT_URL;

module.exports = {
  siteUrl: ROOT_URL,
  generateRobotsTxt: true,
  exclude: ['/server-sitemap.xml', '/private/*', '/account/*', '/api/*'],
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/', disallow: '/*?*' }],
    additionalSitemaps: [`${ROOT_URL}/server-sitemap.xml`],
  },
};
