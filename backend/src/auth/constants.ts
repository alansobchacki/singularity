import { CookieOptions } from 'express';

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};

export const authCookieName = 'access_token';

export const authCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

export const authCookieMaxAge = 8 * 60 * 60 * 1000;
