import 'dotenv/config';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from '../schemas/user.schema';
import { verifyToken } from '../../helpers/jwtHelper';
import { AUTH_ERRORS } from '../../utils/errors';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Method to determine if the current user is allowed to proceed.
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.get('Authorization');
    const accessToken = authHeader?.split(' ')[1]; // Extract the token from the Authorization header

    // Check if the access token is present
    if (!accessToken) {
      throw new UnauthorizedException(AUTH_ERRORS.MISSING_INVALID_TOKEN);
    }

    try {
      // Verify the access token and extract the user ID
      const id = await verifyToken(accessToken);
      // Retrieve the user associated with the token from the database
      const user = await this.userModel.findById(id).exec();

      if (!user || !user.accessToken) {
        throw new UnauthorizedException(AUTH_ERRORS.NO_USER_WITH_TOKEN);
      }
      // Attach user details to the request for use in subsequent handlers
      request.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      };
      return true; // Authentication successful, proceed with the request
    } catch (error) {
      // Handle token verification failures or other errors
      throw new UnauthorizedException(AUTH_ERRORS.AUTH_FAILED + error.message);
    }
  }
}
