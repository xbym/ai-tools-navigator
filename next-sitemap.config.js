module.exports = {
  siteUrl: process.env.SITE_URL || 'https://your-domain.com',
  generateRobotsTxt: true,
  exclude: ['/admin', '/admin/*'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://your-domain.com/api/sitemap.xml', // 更新这里
    ],
  },
};