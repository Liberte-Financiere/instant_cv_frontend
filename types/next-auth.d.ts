import { DefaultSession, DefaultUser } from 'next-auth';

export type AppRole = 'USER' | 'ADMIN' | 'RECRUITER';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role?: AppRole;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role?: AppRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: AppRole;
  }
}
