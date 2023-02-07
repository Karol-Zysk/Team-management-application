import { PrismaService } from '../prisma/prisma.service';
import { SignInDto, SignUpDto } from './dto';
import { JwtService } from '@nestjs/jwt/dist';
import { ConfigService } from '@nestjs/config/dist';
export declare class AuthService {
    private prisma;
    private jwtService;
    private config;
    constructor(prisma: PrismaService, jwtService: JwtService, config: ConfigService);
    signUp(dto: SignUpDto): Promise<any>;
    signIn(dto: SignInDto): Promise<{
        access_token: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<string>;
    hashData(data: string): Promise<string>;
    updateRefreshToken(userId: string, refreshToken: string): Promise<void>;
    getTokens(userId: string, username: string): Promise<{
        access_token: string;
        refreshToken: string;
    }>;
    refreshTokens(userId: string, refreshToken: string): Promise<{
        access_token: string;
        refreshToken: string;
    }>;
}
