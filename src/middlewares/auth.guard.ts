import 'dotenv/config';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { User, userDocument } from 'src/!schemas/user.schema';
import { Model } from 'mongoose';
import { verifyToken } from 'src/helpers/jwtHelper';
import { Reflector } from '@nestjs/core';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<userDocument>,
    private reflector: Reflector, // private jwt: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    const request = context.switchToHttp().getRequest();
    const accessToken = request.get('Authorization')?.split(' ')[1];
    if (accessToken === undefined) {
      throw new UnauthorizedException();
    }
    const id = await verifyToken(accessToken);

    const user = await this.userModel.findById(id);
    if (!user || !user.accessToken) {
      throw new UnauthorizedException();
    }
    request.user = user;

    if (!roles) {
      return true;
    }

    if (roles.includes(user.role)) {
      // Check SECURE_KEY???
      // if (
      //   (roles.includes('Editor') || roles.includes('Admin')) &&
      //   SECURE_KEY === request.SECURE_KEY
      // ) {
      //   return true;
      // }

      return true;
    } else {
      return false;
    }
  }
}
