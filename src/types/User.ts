export interface User {
  _id?: string;
  id?: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  // 其他用户属性
}