import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { findUserByEmail } from '@/models/User';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.role) {
          return null;
        }

        try {
          // Fetch user from database
          const user = await findUserByEmail(credentials.email);
          
          if (user && user.role === credentials.role) {
            // Verify password
            const isValidPassword = await bcrypt.compare(credentials.password, user.password);
            
            if (isValidPassword) {
              return {
                id: user._id?.toString() || '',
                email: user.email,
                name: user.name,
                role: user.role,
                specialty: user.specialty,
              };
            }
          }

          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.specialty = user.specialty;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.specialty = token.specialty;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
});

export { handler as GET, handler as POST };
