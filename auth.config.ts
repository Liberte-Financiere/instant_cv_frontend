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
         '/cv',
         '/recruiter/unlocks',
         '/recruiter/register',
      ]
      
      const isProtected = protectedPaths.some(path => pathname.startsWith(path))
      const isOnLogin = pathname.startsWith('/login')
      const isRoot = pathname === '/'

      // 1. Protected Routes: Block if not logged in
      if (isProtected) {
        if (isLoggedIn) return true
        return false // Redirect to login
      }

      // 2. Login Page: Redirect to Dashboard (or callbackUrl) if already logged in
      if (isOnLogin) {
        if (isLoggedIn) {
          const callbackUrl = nextUrl.searchParams.get('callbackUrl')
          if (callbackUrl) {
            return Response.redirect(new URL(callbackUrl, nextUrl))
          }
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
    async jwt({ token, user, trigger, session }) {
      if (user) {
         token.role = user.role;
      }
      if (trigger === "update" && session?.role) {
         token.role = session.role;
      }
      return token;
    },
    session({ session, user, token }) {
      if (session.user && token?.sub) {
        session.user.id = token.sub
        session.user.role = token.role as import('@/types/next-auth').AppRole;
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  session: { strategy: "jwt" }, // Algorithm compatible with Edge
} satisfies NextAuthConfig
