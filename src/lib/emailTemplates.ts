export function getPasswordResetEmailTemplate(resetUrl: string, username: string): string {
  const logoUrl = 'https://res.cloudinary.com/db2qyyfif/image/upload/v1725528563/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20240905182906_e8qjr9.jpg'; // 替换为你的实际 logo URL

  return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>重置您的密码</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #3490dc; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f8fafc; padding: 20px; }
        .button { display: inline-block; background-color: #3490dc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
        .logo { max-width: 150px; height: auto; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logoUrl}" alt="AI工具导航" class="logo">
          <h1>AI工具导航</h1>
        </div>
        <div class="content">
          <h2>您好，${username}！</h2>
          <p>我们收到了重置您账户密码的请求。如果这不是您本人的操作，请忽略此邮件。</p>
          <p>如果您确实想要重置密码，请点击下面的按钮：</p>
          <p style="text-align: center;">
            <a href="${resetUrl}" class="button">重置密码</a>
          </p>
          <p>此链接将在一小时后失效。</p>
          <p>如果按钮无法点击，请复制以下链接到浏览器地址栏：</p>
          <p>${resetUrl}</p>
          <p>谢谢！</p>
          <p>AI工具导航团队</p>
        </div>
      </div>
    </body>
    </html>
  `;
}