import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import * as jose from "jose"

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

      // Automatic silent restore if impersonation expired
      if (token.impersonationExpiresAt && Date.now() > token.impersonationExpiresAt) {
         if (token.originalUser) {
            token.sub = token.originalUser.sub;
            token.role = token.originalUser.role;
            token.email = token.originalUser.email;
            token.name = token.originalUser.name;
            token.picture = token.originalUser.picture;
         }
         delete token.originalUser;
         delete token.impersonatedBy;
         delete token.impersonationExpiresAt;
         delete token.impersonationSessionId;
         delete token.impersonationJti;
      }

      if (trigger === "update" && session?.impersonationToken) {
         try {
            const secretKey = process.env.IMPERSONATION_SECRET;
            if (!secretKey) throw new Error("IMPERSONATION_SECRET environment variable is not set");
            const secret = new TextEncoder().encode(secretKey);
            
            const { payload } = await jose.jwtVerify(session.impersonationToken, secret);
            
            // Anti-replay check
            if (token.impersonationJti === payload.jti) {
               throw new Error("Token already used");
            }
            // Anti-chaining
            if (token.originalUser) {
               throw new Error("Already impersonating");
            }
            
            // Save original user
            token.originalUser = {
               sub: token.sub,
               role: token.role,
               email: token.email,
               name: token.name,
               picture: token.picture,
            };
            
            // Apply target user
            token.sub = payload.sub;
            token.role = payload.role as import('@/types/next-auth').AppRole;
            token.email = payload.email as string;
            token.name = payload.name as string;
            token.picture = payload.picture as string;
            
            token.impersonatedBy = token.originalUser.sub;
            token.impersonationExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
            token.impersonationSessionId = payload.impersonationSessionId as string;
            token.impersonationJti = payload.jti as string;
         } catch(e) {
            console.error("[IMPERSONATION_JWT_ERROR]", e);
         }
      }

      if (trigger === "update" && session?.stopImpersonation) {
         if (token.originalUser) {
            token.sub = token.originalUser.sub;
            token.role = token.originalUser.role;
            token.email = token.originalUser.email;
            token.name = token.originalUser.name;
            token.picture = token.originalUser.picture;
         }
         delete token.originalUser;
         delete token.impersonatedBy;
         delete token.impersonationExpiresAt;
         delete token.impersonationSessionId;
         delete token.impersonationJti;
      }

      if (trigger === "update" && session?.role && !session?.impersonationToken && !session?.stopImpersonation) {
         token.role = session.role;
      }

      return token;
    },
    session({ session, user, token }) {
      const now = Date.now();
      
      // Enforce expiry on EVERY read (auth() or useSession())
      if (token.impersonationExpiresAt && now > (token.impersonationExpiresAt as number)) {
         if (token.originalUser) {
             const orig = token.originalUser as any;
             session.user.id = orig.sub;
             session.user.role = orig.role;
             session.user.name = orig.name;
             session.user.email = orig.email;
             session.user.image = orig.picture;
             delete session.user.impersonatedBy;
             delete session.user.impersonationSessionId;
         }
      } else if (session.user && token?.sub) {
        session.user.id = token.sub
        session.user.role = token.role as import('@/types/next-auth').AppRole;
        if (token.email) session.user.email = token.email as string;
        if (token.name) session.user.name = token.name as string;
        if (token.picture) session.user.image = token.picture as string;
        
        if (token.impersonatedBy) {
           session.user.impersonatedBy = token.impersonatedBy as string;
           session.user.impersonationSessionId = token.impersonationSessionId as string;
        } else {
           delete session.user.impersonatedBy;
           delete session.user.impersonationSessionId;
        }
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
