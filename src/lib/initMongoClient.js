// lib/mongodb.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // MongoDB URI from environment variables
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

let client;
let clientPromise;

console.log("MONGOURI:", uri)

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so the database connection can be reused
  // during hot reloads, to prevent connections growing exponentially during API Route usage.
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
