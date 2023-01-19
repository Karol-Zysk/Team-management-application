import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto';
import { User } from '@prisma/client';
import { CryptoService } from 'src/cryptography/crypto.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private cryptoService: CryptoService,
  ) {}

  async updateUser(userId: string, dto: UpdateUserDto) {
    const hash_api_key = this.cryptoService.encrypt(dto.clockify_api_key);

    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: { email: dto.email, name: dto.name, hash_api_key },
      });

      delete user.hash_api_key;
      delete user.hash;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException('Invalid user id');
      }
    }
  }

  getMe(user: User) {
    delete user.hash_api_key;
    return user;
  }
}
