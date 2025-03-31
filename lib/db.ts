import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const client = new MongoClient(uri);
const db = client.db('ai-recipe-generator');

export const favoritesCollection = db.collection<{
  userId: string;
  recipe: string;
  likes: number;
}>('favorites');

export const historyCollection = db.collection<{
  userId: string;
  recipe: string;
  timestamp: Date;
}>('history');

export default db;