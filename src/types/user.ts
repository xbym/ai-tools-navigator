export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  // 添加其他可能的用户属性
}