import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CryptoModule } from '../cryptography/crypto.module';
import { CryptoService } from '../cryptography/crypto.service';

@Module({
  imports: [CryptoModule],
  controllers: [UserController],
  providers: [UserService, CryptoService],
})
export class UserModule {}
