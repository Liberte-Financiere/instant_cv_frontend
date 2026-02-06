import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
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
      const isRoot = pathname === '/'

      // 1. Protected Routes: Block if not logged in
      if (isProtected) {
        if (isLoggedIn) return true
        return false // Redirect to login
      }

      // 2. Login Page: Redirect to Dashboard if already logged in
      if (isOnLogin) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/dashboard', nextUrl))
        }
        return true
      }
      
      // 3. Landing Page: Redirect to Dashboard if already logged in
      if (isRoot && isLoggedIn) {
         return Response.redirect(new URL('/dashboard', nextUrl))
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
