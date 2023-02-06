import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { RefreshTokenGuard } from './guard';
import { GetUser } from './decorators';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
  ) {}

  @Post('signup')
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post('signin')
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@GetUser() user: User) {
    const userId = user['sub'];
    const refreshToken = user.refreshToken;
    return this.authService.refreshTokens(userId, refreshToken);
  }
  @UseGuards(RefreshTokenGuard)
  @Get('logout')
  logout(@GetUser() user: User) {
    const userId = user['sub'];
    return this.authService.logout(userId);
  }
}
