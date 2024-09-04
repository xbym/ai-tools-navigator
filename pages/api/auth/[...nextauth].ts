import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import { Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        await dbConnect()
        const user = await User.findOne({ email: credentials.email })

        if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
          return null
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.username,
          role: user.role
        }
      }
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session?.user) {
        session.user.id = token.sub as string
        session.user.role = token.role as string
      }
      return session
    },
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
}

export default NextAuth(authOptions)