import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async updateUser(user: User, dto: UpdateUserDto) {
    const salt = this.config.get('SALT');
    console.log(salt);

    const { id } = user;

    const hash_api_key = await argon.hash(dto.clockify_api_key, {
      salt: this.config.get('SALT'),
    });

    return await this.prisma.user.update({
      where: { id },
      data: { email: dto.email, name: dto.name, hash_api_key },
    });
  }

  getMe() {
    return 'elo';
  }
}
