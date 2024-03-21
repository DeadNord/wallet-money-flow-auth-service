// errors.ts
export const TOKEN_ERRORS = {
  TOKEN_EXPIRED: 'Token has expired.',
  INVALID_TOKEN: 'Invalid token.',
  AUTHENTICATION_FAILED: 'Authentication failed.',
  JWT_SECRET_MISSING: 'JWT secret key is missing.',
};

export const AUTH_ERRORS = {
  MISSING_INVALID_TOKEN: 'Access token is missing or invalid.',
  NO_USER_WITH_TOKEN: 'No user found with this access token.',
  AUTH_FAILED: 'Authentication failed: ',
  EMAIL_ALREADY_EXISTS: 'User with email {email} already exists',
  NOT_AUTHORIZED: 'Not authorized',
  PASSWORD_WRONG: 'Incorrect password provided',
  EMAIL_NOT_FOUND: 'Email {email} not found',
};
