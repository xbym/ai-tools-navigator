module.exports = {
  siteUrl: process.env.SITE_URL || 'https://your-domain.com',
  generateRobotsTxt: true,
  exclude: ['/admin', '/admin/*'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://your-domain.com/server-sitemap.xml', // 我们稍后会创建这个动态站点地图
    ],
  },
};