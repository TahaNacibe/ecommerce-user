import { MongoClient, ServerApiVersion } from "mongodb";

// Ensure the MongoDB URI is defined
if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

// Declare the client variable
let client;
let clientPromise;

// Check if we are in development or production mode
if (process.env.NODE_ENV === "development") {
  // In development, we use a global variable to persist the MongoDB client across Hot Module Replacement (HMR)
  let globalWithMongo = global;

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
  }
  client = globalWithMongo._mongoClient;
  clientPromise = client.connect();
} else {
  // In production, avoid using a global variable
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export the MongoClient instance wrapped in a promise
export default clientPromise;
