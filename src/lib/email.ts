import nodemailer from 'nodemailer';
import { getPasswordResetEmailTemplate } from './emailTemplates';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    console.log('Nodemailer transporter created');

    const info = await transporter.sendMail({
      from: `"AI工具导航" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function sendPasswordResetEmail(to: string, resetUrl: string, username: string) {
  const subject = 'AI工具导航 - 密码重置';
  const text = `请点击以下链接重置您的密码：${resetUrl}`;
  const html = getPasswordResetEmailTemplate(resetUrl, username);

  return sendEmail({ to, subject, text, html });
}