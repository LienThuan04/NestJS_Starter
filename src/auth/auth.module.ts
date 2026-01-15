import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '@/user/user.module';
import { SessionModule } from '@/session/session.module';
import { LocalStrategy } from '@/auth/passport/local.strategy';
import { AppController } from '@/auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './passport/jwt.strategy';
import ms from 'ms';

@Module({
  imports: [
    PassportModule,
    UserModule,
    SessionModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>("JWT_ACCESS_TOKEN_SECRET");
        const expiresIn = configService.get<string>("JWT_ACCESS_EXPIRE");
        return{
          secret: secret,
          signOptions: {
            expiresIn: ms(expiresIn as string)/1000, //chuyển ms sang giây
          }
        }
      },
      inject: [ConfigService],
    })
  ],
  controllers: [AppController],
  providers: [AuthService, LocalStrategy, JwtStrategy ],
  exports: [AuthService],
})
export class AuthModule {}
