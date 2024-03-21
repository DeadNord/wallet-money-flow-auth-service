// External library imports
import { UnauthorizedException } from '@nestjs/common';
import {
  sign,
  verify,
  TokenExpiredError,
  JsonWebTokenError,
  JwtPayload,
} from 'jsonwebtoken';
import 'dotenv/config'; // Ensure environment variables are loaded
import { randomUUID } from 'crypto';

// Internal module imports
import { TOKEN_ERRORS } from '../utils/errors'; // Import error messages from a centralized file

// Environment variable for JWT secret key
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN;
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN;

/**
 * Generates a JWT for a given user ID with predefined validity for access token.
 *
 * @param {string} id - The user's unique identifier.
 * @returns {Promise<string>} A promise that resolves with the generated JWT access token.
 */
const generateAccessToken = async (id: string): Promise<string> => {
  return generateToken(id, ACCESS_TOKEN_EXPIRES_IN);
};

/**
 * Generates a JWT with a new UUID and predefined validity for refresh token.
 *
 * @returns {Promise<string>} A promise that resolves with the generated JWT refresh token.
 */
const generateRefreshToken = async (): Promise<string> => {
  return generateToken(randomUUID(), REFRESH_TOKEN_EXPIRES_IN);
};

/**
 * Generates a JWT for a given user ID.
 *
 * @param {string} id - The user's unique identifier.
 * @param {string} expiresIn - The duration for which the token is valid.
 * @returns {Promise<string>} A promise that resolves with the generated JWT token.
 */
const generateToken = async (
  id: string,
  expiresIn: string,
): Promise<string> => {
  // Ensure the payload contains the necessary user identification
  const payload = { id };

  // Define token expiration settings
  const options = { expiresIn };

  // Throw an error if the JWT secret key is not set
  if (!JWT_SECRET_KEY) {
    throw new Error(TOKEN_ERRORS.JWT_SECRET_MISSING);
  }

  // Sign and return the token
  try {
    return sign(payload, JWT_SECRET_KEY, options);
  } catch (error) {
    throw error; // Rethrow any signing errors
  }
};

/**
 * Verifies a JWT token and extracts the user ID.
 *
 * @param {string} token - The JWT token to be verified.
 * @returns {Promise<string>} A promise that resolves with the user ID encoded in the token.
 */
const verifyToken = async (token: string): Promise<string> => {
  // Ensure the JWT secret key is available

  if (!JWT_SECRET_KEY) {
    throw new Error(TOKEN_ERRORS.JWT_SECRET_MISSING);
  }

  // Attempt to verify the token and extract the payload
  try {
    const { id } = verify(token, JWT_SECRET_KEY) as JwtPayload;
    return id; // Return the user ID from the token payload
  } catch (error) {
    // Handle specific JWT error cases with custom messages
    switch (true) {
      case error instanceof TokenExpiredError:
        throw new UnauthorizedException(TOKEN_ERRORS.TOKEN_EXPIRED);
      case error instanceof JsonWebTokenError:
        throw new UnauthorizedException(TOKEN_ERRORS.INVALID_TOKEN);
      default:
        throw new UnauthorizedException(TOKEN_ERRORS.AUTHENTICATION_FAILED);
    }
  }
};

// Export the utility functions for external use
export {
  generateAccessToken,
  generateRefreshToken,
  generateToken,
  verifyToken,
};
