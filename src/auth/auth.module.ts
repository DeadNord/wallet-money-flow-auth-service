import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Import the service and controller specific to authentication
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

// Import the User schema and interface
import { User, UserSchema } from './schemas/user.schema';

/**
 * The AuthModule integrates user authentication features into the application.
 * It includes models, services, and controllers specific to authentication.
 */
@Module({
  imports: [
    // Register the User schema with Mongoose, making it available within the module
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [
    AuthController, // Register the AuthController to handle HTTP requests
  ],
  providers: [
    AuthService, // Register the AuthService to provide authentication-related services
  ],
})
export class AuthModule {}
