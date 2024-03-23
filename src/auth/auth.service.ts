// External libraries
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

// Mongoose models
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

// DTOs
import { SignInAuthDto, SignUpAuthDto } from './dto';

// Helpers
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from '../helpers/jwtHelper';

// Constants
import { AUTH_ERRORS } from '../utils/errors';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>, // Injecting the user model
  ) {}

  // Sign in a user and return access and refresh tokens
  async signIn({ email, password }: SignInAuthDto) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException(
        AUTH_ERRORS.EMAIL_NOT_FOUND.replace('{email}', email),
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException(AUTH_ERRORS.PASSWORD_WRONG);
    }
    const accessToken = await generateAccessToken(user._id.toString());
    const refreshToken = await generateRefreshToken();

    await this.userModel.findByIdAndUpdate(user._id, {
      accessToken,
      refreshToken,
    });

    return { accessToken, refreshToken };
  }

  // Register a new user
  async signUp({ name, email, mobile, password }: SignUpAuthDto) {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new UnauthorizedException(
        AUTH_ERRORS.EMAIL_ALREADY_EXISTS.replace('{email}', email),
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userModel.create({
      name,
      email,
      mobile,
      password: hashedPassword,
    });
  }

  // Sign out a user by nullifying their tokens
  async signOut(refreshToken: string) {
    const user = await this.userModel.findOneAndUpdate(
      { refreshToken },
      { accessToken: null, refreshToken: null },
    );

    if (!user) {
      throw new UnauthorizedException(AUTH_ERRORS.NOT_AUTHORIZED);
    }
  }

  // Refresh a user's access token
  async refreshAccess(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException(AUTH_ERRORS.NOT_AUTHORIZED);
    }

    await verifyToken(refreshToken);

    const user = await this.userModel.findOne({ refreshToken });
    if (!user) {
      throw new UnauthorizedException(AUTH_ERRORS.NOT_AUTHORIZED);
    }

    try {
      await verifyToken(user.accessToken); // Verifies current access token
      // If this point is reached, current access token is still valid
      return { accessToken: user.accessToken };
    } catch (error) {
      // If token is expired, generate a new one
      if (error instanceof jwt.TokenExpiredError) {
        const newAccessToken = await generateAccessToken(user._id.toString());
        await this.userModel.findByIdAndUpdate(user._id, {
          accessToken: newAccessToken,
        });
        return { accessToken: newAccessToken };
      } else {
        throw error; // Rethrow if error is not related to expiration
      }
    }
  }
}
