import NextAuth from 'next-auth';

export default NextAuth({
  database: process.env.DATABASE_URL,
  session: {
    jwt: true,
  },
  callbacks: {
    async session(session, user) {
      session.user.id = user.id; // Attach user ID to session
      return session;
    },
  },
});