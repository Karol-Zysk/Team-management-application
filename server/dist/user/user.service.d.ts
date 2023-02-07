import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto';
import { User } from '@prisma/client';
import { CryptoService } from '../cryptography/crypto.service';
import { ClockifyService } from '../clockify/clockify.service';
export declare class UserService {
    private prisma;
    private cryptoService;
    private clockify;
    constructor(prisma: PrismaService, cryptoService: CryptoService, clockify: ClockifyService);
    updateUser(userId: string, dto: UpdateUserDto): Promise<User>;
    getMe(user: User): User;
}
