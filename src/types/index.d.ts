import { ResUserDto } from '../auth/dto/resUser.dto';

declare global {
  namespace Express {
    interface Request {
      user?: ResUserDto;
      signedCookies: {
        [key: string]: string;
      };
    }
  }
}
