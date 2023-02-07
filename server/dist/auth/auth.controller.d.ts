import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
export declare class AuthController {
    private authService;
    private prisma;
    constructor(authService: AuthService, prisma: PrismaService);
    signUp(dto: SignUpDto): Promise<any>;
    signIn(dto: SignInDto): Promise<{
        access_token: string;
        refreshToken: string;
    }>;
    refreshTokens(user: User): Promise<{
        access_token: string;
        refreshToken: string;
    }>;
    logout(user: User): Promise<string>;
}
