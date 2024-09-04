import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendResetPasswordEmail(to: string, resetToken: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password/${resetToken}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: '重置您的密码',
    html: `
      <p>您请求重置密码。点击下面的链接来重置您的密码：</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>如果您没有请求重置密码，请忽略此邮件。</p>
    `,
  });
}