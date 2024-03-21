// Third-party library imports
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

// Local imports (from your project modules and utilities)
import { AppModule } from './app.module';
import { setupCors } from './utils/corsSetup';
import { setupSwagger } from './utils/swaggerSetup';

// Environment variables (sorted alphabetically)
import 'dotenv/config';
const COOKIE_SECRET_KEY = process.env.COOKIE_SECRET_KEY;
const PORT = process.env.PORT || 3001;

// Main bootstrap function for the NestJS application
async function bootstrap() {
  // Create a new NestJS application instance
  const app = await NestFactory.create(AppModule, {
    // Configure application logging levels
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // Set a global prefix for all routes
  app.setGlobalPrefix('api');

  // Set up Swagger for API documentation in development environment
  setupSwagger(app);

  // Configure CORS for handling requests from different origins
  // setupCors(app);

  // Middleware for parsing cookies
  app.use(cookieParser(COOKIE_SECRET_KEY));

  // Middleware for enhancing security
  app.use(helmet());

  // Global validation pipe for validating incoming requests
  app.useGlobalPipes(new ValidationPipe());

  // Start listening for incoming requests on the defined port
  await app.listen(PORT, () => {
    console.log(`Service running. Port: ${PORT}`);
  });
}

// Start the application
bootstrap();
