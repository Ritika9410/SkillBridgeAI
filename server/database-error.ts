import { MongoServerError } from 'mongodb';

/** Return actionable database setup guidance without exposing the connection URI. */
export function getDatabaseSetupMessage(error: unknown) {
  if (error instanceof Error && error.message.includes('MONGODB_URI')) {
    return 'MongoDB is not configured. Add MONGODB_URI to .env.local and restart the dev server.';
  }

  if (error instanceof Error && error.name === 'MongoParseError') {
    return 'MONGODB_URI is not a valid MongoDB connection string. Copy the driver URI from Atlas and replace its placeholders.';
  }

  if (
    error instanceof MongoServerError &&
    (error.code === 18 || error.codeName === 'AuthenticationFailed')
  ) {
    return 'MongoDB rejected the database username or password. Check the Database Access user and URL-encode special characters in its password.';
  }

  if (error instanceof Error && error.name === 'MongoServerSelectionError') {
    return 'Could not reach MongoDB Atlas. Confirm the cluster is available and your current IP address is Active in Atlas Network Access.';
  }

  return 'MongoDB connection failed. Check the server output for the error type, without sharing your connection string.';
}
