import { Injectable } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {}

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {}
