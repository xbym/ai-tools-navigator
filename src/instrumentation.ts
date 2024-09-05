export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const Sentry = require('@sentry/nextjs');
    Sentry.init({
      dsn: "https://37de25f0d5af56e43ffeb80ab5ca50c1@o4507895292952576.ingest.de.sentry.io/4507895297278032",
      // 其他 Sentry 配置...
    });
  }
}