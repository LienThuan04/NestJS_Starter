
import { IS_PUBLIC_KEY } from '@/decorator/metadata';
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import request from 'supertest';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private reflector: Reflector
    ) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        if (err || !user) {
            throw err || new UnauthorizedException('Invalid or expired token');
        } else if (info) {
            throw new UnauthorizedException(info.message);
        }
        return user;;
    }
}
