// utils/cors-setup.ts
import { INestApplication } from '@nestjs/common';

// Retrieve environment variables directly in the file
const CLIENT_URL = process.env.CLIENT_URL; // The client URL(s) for your application in production
const LOCAL_URL = process.env.LOCAL_URL; // The local URL for your application in development
const NODE_ENV = process.env.NODE_ENV; // The current environment ('development', 'production', etc.)

/**
 * Configures CORS (Cross-Origin Resource Sharing) settings for the application.
 * This setup allows for different origins in development versus production environments
 * to enhance security while allowing necessary resources to be accessed cross-origin.
 *
 * @param {INestApplication} app - The instance of the NestJS application.
 */
export function setupCors(app: INestApplication): void {
  app.enableCors({
    // Apply settings based on the development environment
    origin: NODE_ENV === 'development' ? LOCAL_URL : CLIENT_URL.split(','),
    // Allows credentials such as cookies, authorization headers, or TLS client certificates
    credentials: true,
    // Allows preflight requests to pass through
    preflightContinue: false,
    // Specifies which methods are allowed when accessing the resource
    methods: 'GET,POST,DELETE',
  });
}
