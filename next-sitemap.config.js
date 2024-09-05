/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://your-actual-domain.com', // 替换为您的实际域名
  generateRobotsTxt: true,
  exclude: ['/admin', '/admin/*'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://your-actual-domain.com/api/sitemap.xml', // 更新这里
    ],
  },
};