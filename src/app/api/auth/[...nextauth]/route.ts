import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "用户名", type: "text", placeholder: "请输入用户名" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials, req) {
        // 这里应该是验证逻辑
        // 为了演示,我们使用一个硬编码的用户
        if (credentials?.username === "user" && credentials?.password === "password") {
          return { id: "1", name: "Test User", email: "test@example.com" }
        } else {
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
})

export { handler as GET, handler as POST }