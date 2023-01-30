import { Module } from '@nestjs/common';
import { ClockifyService } from './clockify.service';
import { CryptoModule } from '../cryptography/crypto.module';
import { CryptoService } from '../cryptography/crypto.service';

@Module({
  imports: [CryptoModule],
  providers: [ClockifyService, CryptoService],
})
export class ClockifyModule {}
