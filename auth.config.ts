import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const { pathname } = nextUrl

      // Protected paths
      const protectedPaths = [
         '/dashboard', 
         '/editor', 
         '/settings', 
         '/templates', 
         '/analysis', 
         '/signature',
         '/cv'
      ]
      
      const isProtected = protectedPaths.some(path => pathname.startsWith(path))
      const isOnLogin = pathname.startsWith('/login')

      if (isProtected) {
        if (isLoggedIn) return true
        return false // Redirect to login
      }

      if (isOnLogin) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/dashboard', nextUrl))
        }
        return true
      }
      return true
    },
    session({ session, user, token }) {
      if (session.user && token?.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
  session: { strategy: "jwt" }, // Algorithm compatible with Edge
} satisfies NextAuthConfig
