import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuthDto } from './dto/create-auth.dto';
// import dayjs from 'dayjs';
// const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
import jwt from 'jsonwebtoken';
import { generateToken, verifyToken } from '../helpers/jwtHelper';
// import * as bcrypt from 'bcrypt';
import { User, userDocument } from 'src/!schemas/user.schema';
import { randomUUID } from 'crypto';
import { v4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<userDocument>,
  ) {}

  async signIn(createAuthDto: CreateAuthDto) {
    // const { wallet, password } = createAuthDto;
    const { wallet } = createAuthDto;

    const user = await this.userModel.findOne({ wallet });

    if (!user) {
      const verificationToken = randomUUID();
      // const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      const user = await this.userModel.create({
        wallet,
        // password: hashPassword,
        'emailData.verificationToken': verificationToken,
      });
      const accessToken = await generateToken(user._id, '15m');
      const refreshToken = await generateToken(v4(), '1h');
      await this.userModel.findByIdAndUpdate(user._id, {
        accessToken,
        refreshToken,
      });
      return { accessToken, refreshToken };
    }

    // try {
    //   bcrypt.compareSync(password, user.password);
    // } catch (error) {
    //   throw new UnauthorizedException(`Password wrong`);
    // }

    const checkToken = async (token, _id, type) => {
      if (token) {
        try {
          await verifyToken(token);
        } catch (error) {
          if (error.message === 'expired') {
            if (type === 'access') {
              const token = await generateToken(_id, '15m');
              await this.userModel.findByIdAndUpdate(_id, {
                accessToken: token,
              });
              return token;
            }

            if (type === 'refresh') {
              const token = await generateToken(v4(), '1h');
              await this.userModel.findByIdAndUpdate(_id, {
                refreshToken: token,
              });
              return token;
            }
          }
          throw error;
        }
        return token;
      }
      if (type === 'access') {
        const token = await generateToken(_id, '15m');
        await this.userModel.findByIdAndUpdate(_id, {
          accessToken: token,
        });
        return token;
      }

      if (type === 'refresh') {
        const token = await generateToken(v4(), '1h');
        await this.userModel.findByIdAndUpdate(_id, {
          refreshToken: token,
        });
        return token;
      }
    };

    const accessToken = await checkToken(user.accessToken, user._id, 'access');
    const refreshToken = await checkToken(
      user.refreshToken,
      user._id,
      'refresh',
    );

    return { accessToken, refreshToken };
  }

  async refreshAccess(token: string) {
    const refreshToken = token;

    if (!refreshToken) {
      throw new UnauthorizedException(`Not authorized`);
    }
    // console.log(refreshToken);

    try {
      await verifyToken(refreshToken);
    } catch (error) {
      throw new UnauthorizedException();
    }
    // await verifyToken(refreshToken);

    const user = await this.userModel.findOne({ refreshToken });

    if (!user) {
      throw new UnauthorizedException(`Not authorized`);
    }

    if (user.accessToken) {
      const accessToken = user.accessToken;

      try {
        // console.log(accessToken);
        await verifyToken(accessToken);
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
          const accessToken = await generateToken(user._id, '15m');
          await this.userModel.findByIdAndUpdate(user._id, {
            accessToken,
          });
          return { accessToken };
        }
      }
      return { accessToken };
    }

    const accessToken = await generateToken(user._id, '15m');

    await this.userModel.findByIdAndUpdate(user._id, {
      accessToken,
    });

    return { accessToken };
  }

  async signOut(token: string) {
    const refreshToken = token;

    if (!refreshToken) {
      throw new UnauthorizedException(`Not authorized`);
    }

    // const user = await this.userModel.findOne({ refreshToken });

    // if (!user) {
    //   throw new UnauthorizedException(`Not authorized`);
    // }

    const user = await this.userModel.findOneAndUpdate(
      { refreshToken },
      {
        accessToken: null,
        refreshToken: null,
      },
    );

    if (!user) {
      throw new UnauthorizedException(`Not authorized`);
    }

    return true;
  }
}
