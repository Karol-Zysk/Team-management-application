import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto';
import { User } from '@prisma/client';
import { CryptoService } from 'src/cryptography/crypto.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private cryptoService: CryptoService,
  ) {}

  async updateUser(user: User, dto: UpdateUserDto) {
    const hash_api_key = this.cryptoService.encrypt(dto.clockify_api_key);

    return await this.prisma.user.update({
      where: { id: user.id },
      data: { email: dto.email, name: dto.name, hash_api_key },
    });
  }

  getMe(user: User) {
    return user;
  }
}
