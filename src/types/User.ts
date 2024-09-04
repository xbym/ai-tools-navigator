export interface User {
  id: string;
  email: string;
  name?: string;
  username: string;
  password: string;
}

export interface NextAuthUser {
  id: string;
  email: string;
  name?: string;
  username: string;
}