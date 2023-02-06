import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }
  async validate(payload: { sub: string; email: string }) {
    try {
      const { sub: id } = payload;
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });
      if (!user) throw new UnauthorizedException(`user doesen't exist`);

      delete user.hash;
      delete user.refreshToken;

      return user;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
