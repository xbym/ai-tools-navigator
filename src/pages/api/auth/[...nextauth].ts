import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'

// 这里应该是你的数据库连接
// import { db } from '../../../lib/db'

export default NextAuth({
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

        // 查找用户
        // const user = await db.user.findUnique({ where: { email: credentials.email } })
        // 模拟用户
        const user = { id: '1', email: credentials.email, password: await hash('password', 12) }

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
  // ... 其他配置
})