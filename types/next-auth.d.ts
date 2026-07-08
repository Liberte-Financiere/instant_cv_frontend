import { DefaultSession, DefaultUser } from 'next-auth';

export type AppRole = 'USER' | 'ADMIN' | 'RECRUITER';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role?: AppRole;
      impersonatedBy?: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role?: AppRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: AppRole;
    originalUser?: {
      sub?: string;
      role?: AppRole;
      email?: string | null;
      name?: string | null;
      picture?: string | null;
    };
    impersonatedBy?: string;
    impersonationExpiresAt?: number;
    impersonationSessionId?: string;
    impersonationJti?: string;
  }
}
