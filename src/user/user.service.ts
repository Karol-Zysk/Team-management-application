import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { AES, enc } from 'crypto-js';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async updateUser(user: User, dto: UpdateUserDto) {
    const plaintext = dto.clockify_api_key;

    const encryptionKey = this.config.get('ENCRYPTION_KEY');
    const hash_api_key = AES.encrypt(plaintext, encryptionKey).toString();

    const { id } = user;

    return await this.prisma.user.update({
      where: { id },
      data: { email: dto.email, name: dto.name, hash_api_key },
    });
  }

  getMe(user: User) {
    return user;
  }
}
