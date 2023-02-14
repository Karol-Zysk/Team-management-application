"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const exceptions_1 = require("@nestjs/common/exceptions");
const dist_1 = require("@nestjs/jwt/dist");
const dist_2 = require("@nestjs/config/dist");
let AuthService = class AuthService {
    constructor(prisma, jwtService, config) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.config = config;
    }
    async signUp(dto) {
        try {
            const userExists = await this.prisma.user.findFirst({
                where: {
                    OR: [{ email: dto.email }, { name: dto.name }],
                },
            });
            if (userExists) {
                throw new exceptions_1.ConflictException('User already exists');
            }
            const hash = await this.hashData(dto.password);
            const newUser = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    name: dto.name,
                    hash,
                },
            });
            const tokens = await this.getTokens(newUser.id, newUser.email);
            await this.updateRefreshToken(newUser.id, tokens.refreshToken);
            return tokens;
        }
        catch (error) {
            throw new exceptions_1.BadRequestException(error.message);
        }
    }
    async signIn(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user)
            throw new exceptions_1.BadRequestException('User does not exist');
        const passwordMatches = await bcrypt.compare(dto.password, user.hash);
        if (!passwordMatches)
            throw new exceptions_1.BadRequestException('Password is incorrect');
        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
    async logout(userId) {
        this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
        return 'Logged Out';
    }
    hashData(data) {
        return bcrypt.hash(data, 10);
    }
    async updateRefreshToken(userId, refreshToken) {
        const hashedRefreshToken = await this.hashData(refreshToken);
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: hashedRefreshToken },
        });
    }
    async getTokens(userId, username) {
        const [access_token, refreshToken] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                username,
            }, {
                secret: this.config.get('JWT_SECRET'),
                expiresIn: '3h',
            }),
            this.jwtService.signAsync({
                sub: userId,
                username,
            }, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
                expiresIn: '30d',
            }),
        ]);
        return {
            access_token,
            refreshToken,
        };
    }
    async refreshTokens(userId, refreshToken) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.refreshToken)
            throw new exceptions_1.ForbiddenException('Access Denied');
        const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!refreshTokenMatches)
            throw new exceptions_1.ForbiddenException('Access Denied');
        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        dist_1.JwtService,
        dist_2.ConfigService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map