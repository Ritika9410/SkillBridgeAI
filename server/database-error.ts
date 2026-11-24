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

  const networkCode = getNetworkErrorCode(error);
  if (networkCode) {
    const networkStage = getNetworkFailureStage(error);
    if (networkStage === 'srv-dns') {
      return `Atlas SRV DNS lookup failed (${networkCode}). In Atlas Connect → Drivers, turn off the SRV connection string option and try the generated standard URI, or use a DNS resolver that supports SRV records.`;
    }
    if (networkStage === 'tcp') {
      return `The backend could not open a TCP connection to Atlas (${networkCode}). Confirm the backend IP is allowed and outbound TCP ports 27015–27017 are permitted by the network/firewall.`;
    }
    return `The backend could not reach MongoDB Atlas (${networkCode}). Confirm the cluster is running, this backend's IP is allowed in Atlas Network Access, and outbound DNS/network access is available.`;
  }

  if (error instanceof Error && error.name === 'MongoServerSelectionError') {
    return 'Could not reach MongoDB Atlas. Confirm the cluster is available and your current IP address is Active in Atlas Network Access.';
  }

  return 'MongoDB connection failed. Check the server output for the error type, without sharing your connection string.';
}

/** Log only safe error metadata; never include messages, hosts, or connection strings. */
export function getSafeDatabaseErrorLabel(error: unknown) {
  if (!(error instanceof Error)) return 'UnknownError';

  const networkCode = getNetworkErrorCode(error);
  if (networkCode) {
    const networkStage = getNetworkFailureStage(error);
    return `${error.name}${networkStage ? ` ${networkStage}` : ''} (${networkCode})`;
  }

  if ('code' in error && (typeof error.code === 'number' || typeof error.code === 'string')) {
    const code = String(error.code);
    if (/^[A-Z0-9_]+$/.test(code)) return `${error.name} (${code})`;
  }

  return error.name;
}

function getNetworkErrorCode(error: unknown, depth = 0): string | undefined {
  if (!error || typeof error !== 'object' || depth > 2) return undefined;

  if ('code' in error && typeof error.code === 'string') {
    const code = error.code.toUpperCase();
    if (['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'EAI_AGAIN'].includes(code)) return code;
  }

  return 'cause' in error ? getNetworkErrorCode(error.cause, depth + 1) : undefined;
}

function getNetworkFailureStage(error: unknown, depth = 0): 'srv-dns' | 'tcp' | undefined {
  if (!error || typeof error !== 'object' || depth > 2) return undefined;

  if (error instanceof Error) {
    if (/querySrv|_mongodb\._tcp/i.test(error.message)) return 'srv-dns';
    if (/\bconnect\s+ECONN(?:REFUSED|RESET|TIMEDOUT)\b/i.test(error.message)) return 'tcp';
  }

  return 'cause' in error ? getNetworkFailureStage(error.cause, depth + 1) : undefined;
}
