export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  // 添加其他你需要的用户属性
}