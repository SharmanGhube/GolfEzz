import NextAuth, { NextAuthOptions, User as NextAuthUser, Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { JWT } from "next-auth/jwt"

// Extend the built-in types
declare module "next-auth" {
  interface User {
    id: string
    email: string
    name: string
    role: 'member' | 'admin' | 'super_admin'
    membershipType?: string
    adminLevel?: string
    image?: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: 'member' | 'admin' | 'super_admin'
      membershipType?: string
      adminLevel?: string
      image?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: 'member' | 'admin' | 'super_admin'
    membershipType?: string
    adminLevel?: string
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        expectedRole: { label: "Expected Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Call your backend API to authenticate user
          const response = await fetch(`${process.env.API_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              expected_role: credentials.expectedRole, // Pass expected role to backend
            }),
          })

          if (!response.ok) {
            return null
          }

          const data = await response.json()
          
          // Backend returns { token, user, expires_at }
          if (data && data.user && data.user.id) {
            const user = data.user;
            return {
              id: user.id.toString(),
              email: user.email,
              name: user.name,
              role: user.role,
              membershipType: user.membership_type,
              adminLevel: user.admin_level,
              image: user.image,
            }
          }
        } catch (error) {
          console.error('Authentication error:', error)
        }

        return null
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only allow credentials provider
      return account?.provider === "credentials"
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.membershipType = user.membershipType
        token.adminLevel = user.adminLevel
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.membershipType = token.membershipType
        session.user.adminLevel = token.adminLevel
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
