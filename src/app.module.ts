import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';

// Environment variables
const DB_HOST = process.env.DB_HOST;
const THROTTLER_TTL = Number(process.env.THROTTLER_TTL); // Time-to-Live for throttling
const THROTTLER_LIMIT = Number(process.env.THROTTLER_LIMIT); // Request limit for throttling

@Module({
  imports: [
    // Database module setup
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: DB_HOST, // Database connection URI
      }),
    }),
    // Throttling module setup
    ThrottlerModule.forRoot([
      {
        ttl: THROTTLER_TTL, // Time-to-Live for request records in seconds
        limit: THROTTLER_LIMIT, // Maximum number of requests within TTL
      },
    ]),
    // Application modules
    AuthModule, // Authentication module
  ],
  providers: [
    // Global guard for throttling requests across all routes
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
