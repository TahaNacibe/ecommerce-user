import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/db";  // clientPromise is the correct import

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'select_account',
          access_type: 'offline',
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
      async signIn({ user, account, profile }) {
      // Resolve clientPromise to get the actual client instance
      const client = await clientPromise;  // Resolving the client from clientPromise
      const usersCollection = client.db().collection('users');
          const userProfilesCollection = client.db().collection('user_profiles');
  
      // Check if the user already exists
      const existingUser = await usersCollection.findOne({ email: user.email });
  
      if (!existingUser) {
        // If it's the first-time user, create a profile in the user_profiles collection
        await userProfilesCollection.insertOne({
          email: user.email,
          role: 'user',  // Default role
          orders: [],    // Empty array for orders
          favoriteItems: [],  // Empty array for favorite items
        });
      }
  
      return true;  // Proceed with the sign-in
    },
  
    async session({ session, user }) {
      // Resolve clientPromise to get the actual client instance
      const client = await clientPromise;  // Resolving the client from clientPromise
      
      // Fetch the user's profile data from the user_profiles collection
        const userProfile = await client.db().collection('user_profiles').findOne({ email: user.email });
        if (userProfile) {
            // Attach the profile data to the session object
            session.user.role = userProfile.role;
            session.user.orders = userProfile.orders;
            session.user.favoriteItems = userProfile.favoriteItems;
        }
  
      return session;
    },
  },
};

export default NextAuth(authOptions);
