/**
 * Check same-origin mutations using the public request URL when the app is
 * behind a reverse proxy such as Render's HTTPS edge.
 */
export function isSameOrigin(request: Request): boolean {
  const originHeader = request.headers.get('origin');
  if (!originHeader) return true;

  try {
    const origin = new URL(originHeader);
    const requestUrl = new URL(request.url);
    const forwardedHost = firstHeaderValue(request.headers.get('x-forwarded-host'));
    const forwardedProtocol = firstHeaderValue(request.headers.get('x-forwarded-proto'));
    const host = forwardedHost || request.headers.get('host') || requestUrl.host;
    const protocol = forwardedProtocol || requestUrl.protocol.slice(0, -1);
    const publicRequestUrl = new URL(`${protocol}://${host}`);

    return origin.origin === publicRequestUrl.origin;
  } catch {
    return false;
  }
}

function firstHeaderValue(value: string | null): string {
  return value?.split(',')[0]?.trim().toLowerCase() ?? '';
}
