import { timingSafeEqual } from 'crypto';

type AuthResult =
  | { authorized: true }
  | { authorized: false; status: 401 | 500; error: string };

export function verifyContactsApiToken(
  authHeader: string | null | undefined
): AuthResult {
  const expected = process.env.CONTACTS_API_TOKEN;
  if (!expected) {
    return {
      authorized: false,
      status: 500,
      error: 'CONTACTS_API_TOKEN is not configured',
    };
  }

  if (!authHeader?.startsWith('Bearer ')) {
    return { authorized: false, status: 401, error: 'Unauthorized' };
  }

  const provided = authHeader.slice('Bearer '.length);
  const providedBuf = Buffer.from(provided);
  const expectedBuf = Buffer.from(expected);

  if (
    providedBuf.length !== expectedBuf.length ||
    !timingSafeEqual(providedBuf, expectedBuf)
  ) {
    return { authorized: false, status: 401, error: 'Unauthorized' };
  }

  return { authorized: true };
}
