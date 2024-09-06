module.exports = {
  siteUrl: 'https://ai-tools-navigator.vercel.app',
  generateRobotsTxt: true,
  exclude: ['/admin', '/admin/*'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://your-domain.com/api/sitemap.xml', // 更新这里
    ],
  },
};