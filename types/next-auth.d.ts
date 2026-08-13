import { DefaultSession, DefaultUser } from 'next-auth';

export type AppRole = 'USER' | 'ADMIN' | 'RECRUITER' | 'SCHOOL_ADMIN';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role?: AppRole;
      schoolId?: string | null;
      impersonatedBy?: string;
      impersonationSessionId?: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role?: AppRole;
    schoolId?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: AppRole;
    schoolId?: string | null;
    originalUser?: {
      sub?: string;
      role?: AppRole;
      schoolId?: string | null;
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
