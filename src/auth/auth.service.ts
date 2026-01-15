import { comparePassword } from '@/lib/bcrypt';
import { IUser } from '@/user/interface/IUser';
import { UserService } from '@/user/user.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import type { Response } from 'express';
import { CreateSessionDto } from '@/session/dto/create-session.dto';
import { Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { SessionService } from '@/session/session.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly sessionService: SessionService,
        

    ) { }

    private readonly refresh_token: string = "refresh_token";


    async validateUser(username: string, password: string): Promise<any> {
        const user: any = await this.userService.findByUsernameOrEmail(username);
        if (user && await comparePassword(password, user.password)) {
            const { password, ...result } = user.toObject();
            return result;
        }
        return null;
    }

    async generateRefreshToken(payload: { _sub: string; _id: string }): Promise<string> {
        const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRE');
        const refresh_token = this.jwtService.sign(payload, { // ghi đè các giá trị trong jwt.module.ts
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: ms(expiresIn as string) / 1000, //chuyển từ milliseconds sang seconds
        });
        return refresh_token;
    }

    async login(user: IUser, res: Response): Promise<any> {
        const refreshToken = await this.generateRefreshToken({ _sub: user._id, _id: user._id });
        const CreateSessionDto: CreateSessionDto = {
            userId: user._id as unknown as Types.ObjectId,
            refreshToken: refreshToken,
        };
        const setSessionDB = await this.sessionService.UpSertSessionAsync(CreateSessionDto);
        if (!setSessionDB) {
            throw new BadRequestException('Failed to create session');
        }
        res.cookie(this.refresh_token, refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE') as string),
            secure: true,
        });
        const payLoad: IUser = {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            avatar: user.avatar,
        };
        const accessToken = this.jwtService.sign(payLoad);
        return {
            message: 'Login successful',
            accessToken: accessToken,
            user,
        };
    }

    async refreshToken(oldRefreshToken: string, res: Response): Promise<any> {
        try {
            if (!oldRefreshToken || oldRefreshToken === '' || oldRefreshToken === 'undefined') {
                throw new BadRequestException('Refresh token is missing');
            }
            this.jwtService.verify(oldRefreshToken, {
                secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            });
            const session = await this.sessionService.findSessionByRefreshTokenAndUserId(oldRefreshToken);
            if (!session) {
                throw new BadRequestException('Session not found for the provided refresh token and user ID');
            }
            const userFetch: any = await this.userService.findOne(session.userId.toString());
            if(userFetch._id.toString() !== session.userId.toString()){
                throw new BadRequestException('User ID does not match session user ID');
            }
            const User: IUser = {
                _id: userFetch._id,
                userName: userFetch.userName,
                email: userFetch.email,
                avatar: userFetch.avatar,
            };
            if (!User || !User._id || !User.userName || !User.email) {
                throw new BadRequestException('User not found for this refresh token');
            }
            res.clearCookie(this.refresh_token);
            return await this.login(User, res);
        } catch (error) {
            throw new BadRequestException('Invalid refresh token: ' + error.message);
        }
    }

    async logout(userId: string, res: Response): Promise<boolean> {
        try {
            const result = await this.sessionService.DeleteSessionByUserId(userId);
            if (!result) {
                throw new BadRequestException('Failed to delete session');
            }
            res.clearCookie(this.refresh_token);
            return true;
        } catch (error) {
            throw new BadRequestException('Logout failed: ' + error.message);
        }
    }
}
