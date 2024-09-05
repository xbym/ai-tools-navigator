export interface User {
<<<<<<< HEAD
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
=======
  _id?: string;
  id?: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  // 其他用户属性
>>>>>>> 35606fa0e13de8545a3679d5a797af92108be371
}