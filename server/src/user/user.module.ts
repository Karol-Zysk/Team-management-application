import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CryptoModule } from '../cryptography/crypto.module';
import { CryptoService } from '../cryptography/crypto.service';
import { ClockifyService } from '../clockify/clockify.service';
import { ClockifyModule } from '../clockify/clockify.module';

@Module({
  imports: [CryptoModule, ClockifyModule],
  controllers: [UserController],
  providers: [UserService, CryptoService, ClockifyService],
})
export class UserModule {}
