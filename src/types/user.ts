export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  avatarUrl?: string; // 添加这行
  // 添加其他可能的用户属性
}