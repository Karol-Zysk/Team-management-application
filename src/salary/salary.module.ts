import { Module } from '@nestjs/common';
import { SalaryService } from './salary.service';
import { SalaryController } from './salary.controller';
import { ClockifyModule } from 'src/clockify/clockify.module';
import { ClockifyService } from 'src/clockify/clockify.service';
import { CryptoModule } from 'src/cryptography/crypto.module';
import { CryptoService } from 'src/cryptography/crypto.service';

@Module({
  imports: [ClockifyModule, CryptoModule],
  providers: [SalaryService, ClockifyService, CryptoService],
  controllers: [SalaryController],
})
export class SalaryModule {}
