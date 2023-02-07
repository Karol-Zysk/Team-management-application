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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto_service_1 = require("../cryptography/crypto.service");
const runtime_1 = require("@prisma/client/runtime");
const clockify_service_1 = require("../clockify/clockify.service");
let UserService = class UserService {
    constructor(prisma, cryptoService, clockify) {
        this.prisma = prisma;
        this.cryptoService = cryptoService;
        this.clockify = clockify;
    }
    async updateUser(userId, dto) {
        const hash_api_key = this.cryptoService.encrypt(dto.clockify_api_key);
        try {
            const updatedUser = await this.prisma.user.update({
                where: { id: userId },
                data: { email: dto.email, name: dto.name, hash_api_key },
            });
            delete updatedUser.hash_api_key;
            delete updatedUser.hash;
            delete updatedUser.refreshToken;
            return updatedUser;
        }
        catch (error) {
            if (error instanceof runtime_1.PrismaClientKnownRequestError) {
                throw new common_1.BadRequestException('Invalid user id');
            }
        }
    }
    getMe(user) {
        delete user.hash_api_key;
        return user;
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        crypto_service_1.CryptoService,
        clockify_service_1.ClockifyService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map