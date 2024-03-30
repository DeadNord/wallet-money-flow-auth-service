// utils/swagger-setup.ts
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Sets up Swagger documentation for the application.
 * This is typically used in development environments to provide an interactive API documentation.
 *
 * @param {INestApplication} app - The instance of the NestJS application.
 */
export function setupSwagger(app: INestApplication): void {
  // Configure the Swagger documentation builder with information about your API
  const options = new DocumentBuilder()
    .setTitle('Auth-Service') // Title of the API
    .setDescription('The Auth-Service API description') // Short description or summary of the API
    .setVersion('1.0') // Version of the API
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, // Authentication configuration
      'access-token', // Identifier for the security scheme in documentation
    )
    .build(); // Build the Swagger options

  // Create Swagger documentation based on the setup options
  const document = SwaggerModule.createDocument(app, options);

  // Serve the Swagger UI on the '/docs/swagger' path
  SwaggerModule.setup('api/auth/swagger', app, document);
}
