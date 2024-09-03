import NextAuth, { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import bcrypt from 'bcryptjs';
import { JWT } from 'next-auth/jwt'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "邮箱", type: "text" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        // 模拟用户
        const user = { id: '1', email: credentials.email, password: await bcrypt.hash('password', 10) }

        if (!user) {
          return null
        }

        // 验证密码
        const isValid = await compare(credentials.password, user.password)

        if (!isValid) {
          return null
        }

        return { id: user.id, email: user.email }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  }
}

export default NextAuth(authOptions)