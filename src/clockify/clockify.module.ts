import { Module } from '@nestjs/common';
import { ClockifyService } from './clockify.service';
import { CryptoModule } from 'src/cryptography/crypto.module';
import { CryptoService } from 'src/cryptography/crypto.service';

@Module({
  imports: [CryptoModule],
  providers: [ClockifyService, CryptoService],
})
export class ClockifyModule {}
