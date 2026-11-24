import { Db, MongoClient } from 'mongodb';

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
};

export async function getDatabase(): Promise<Db> {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) throw new Error('MongoDB is not configured. Add MONGODB_URI to .env.local.');

  if (!globalForMongo.mongoClientPromise) {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000, family: 4 });
    globalForMongo.mongoClientPromise = client.connect().catch(async (error: unknown) => {
      globalForMongo.mongoClientPromise = undefined;
      await client.close().catch(() => undefined);
      throw error;
    });
  }

  const client = await globalForMongo.mongoClientPromise;
  return client.db(process.env.MONGODB_DB?.trim() || 'skillbridgeai');
}
