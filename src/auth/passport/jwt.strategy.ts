import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from '@/user/interface/IUser';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET') as string, //mã hóa token với signature giống như trong AuthModule để giải mã payload
    });
  }

  async validate(payload: IUser) { //hàm này được gọi tự động bởi Passport sau khi token được xác thực thành công
    const { _id, userName, email, avatar } = payload;
    //return for request.user
    return { _id, userName, email, avatar };
  }
}