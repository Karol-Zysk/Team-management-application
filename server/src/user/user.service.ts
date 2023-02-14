import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto';
import { User } from '@prisma/client';
import { CryptoService } from '../cryptography/crypto.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ClockifyService } from '../clockify/clockify.service';
import Clockify from 'clockify-ts';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private cryptoService: CryptoService,
    private clockify: ClockifyService,
  ) {}

  async updateUser(userId: string, dto: UpdateUserDto) {
    try {
      const clockify = new Clockify(dto.clockify_api_key);
      await clockify.workspaces.get();
    } catch (error) {
      throw new BadRequestException('Invalid Api Key');
    }
    try {
      const hash_api_key = this.cryptoService.encrypt(dto.clockify_api_key);
      let active: boolean;
      if (dto.clockify_api_key) active = true;

      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: { hash_api_key, active, companyName: dto.companyName },
      });

      delete updatedUser.hash_api_key;
      delete updatedUser.hash;
      delete updatedUser.refreshToken;
      return updatedUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  getMe(user: User) {
    delete user.hash_api_key;
    return user;
  }
}
