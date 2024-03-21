import 'dotenv/config';
import { Response } from 'express';

const DEFAULT_EXPIRES_IN_MINUTES = 60; // Default expiration time (e.g., 60 minutes)
const NODE_ENV = process.env.NODE_ENV || 'development'; // Default to 'development' if not set

const saveTokenCookies = async (
  res: Response,
  key: string,
  data: string,
  expiresInMinutes: number = DEFAULT_EXPIRES_IN_MINUTES, // Default value if not provided
): Promise<void> => {
  const expirationTime = Date.now() + expiresInMinutes * 60 * 1000; // Compute expiration time
  const expires = new Date(expirationTime);

  res.cookie(key, data, {
    expires,
    httpOnly: true,
    signed: true,
    secure: NODE_ENV !== 'development',
    sameSite: NODE_ENV !== 'development' ? 'none' : 'lax',
  });
};

const clearTokenCookies = async (res: Response, key: string): Promise<void> => {
  res.clearCookie(key);
};

export { saveTokenCookies, clearTokenCookies };
