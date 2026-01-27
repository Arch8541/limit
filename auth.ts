import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';

// Validate critical environment variables
if (process.env.NODE_ENV === 'production') {
  if (!process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET === 'your-secret-key-change-in-production') {
    console.error('CRITICAL: NEXTAUTH_SECRET must be set to a secure value in production!');
  }
  if (!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.includes('localhost')) {
    console.error('CRITICAL: NEXTAUTH_URL must be set to your production domain (e.g., https://your-app.vercel.app)');
  }
  if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.includes('postgresql')) {
    console.error('CRITICAL: DATABASE_URL must be set to a PostgreSQL connection string for production!');
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true, // Required for Vercel deployment
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('Missing credentials');
            return null;
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user) {
            console.log('User not found:', credentials.email);
            return null;
          }

          if (!user.password) {
            console.log('User has no password (OAuth user?)');
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isValid) {
            console.log('Invalid password for user:', credentials.email);
            return null;
          }

          console.log('Login successful for user:', user.email);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        console.log('JWT callback - user logged in:', user.email);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string | null;
        console.log('Session callback - session created for:', token.email);
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
});
