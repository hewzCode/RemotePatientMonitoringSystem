// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        pid: { label: 'Username', type: 'text' },
      },
      async authorize(credentials) {
        // For simplicity, we're using hardcoded user data
        if (credentials.pid === 'patient1') {
          // Simulate getting the patient IPFS hash from a secure location
          return { id: 1, name: 'John Doe', patientHash: 'bafkreib4pqtikzdjlj4zigobmd63lig7u6oxlug24snlr6atjlmlza45dq' };
        } else {
          return null; // Invalid login
        }
      },
    }),
  ],
  pages: {
    signIn: '/login', // Custom login page
  },
});
