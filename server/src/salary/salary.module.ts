import { Module } from '@nestjs/common';
import { SalaryService } from './salary.service';
import { SalaryController } from './salary.controller';
import { ClockifyModule } from '../clockify/clockify.module';
import { ClockifyService } from '../clockify/clockify.service';
import { CryptoModule } from '../cryptography/crypto.module';
import { CryptoService } from '../cryptography/crypto.service';

@Module({
  imports: [ClockifyModule, CryptoModule],
  providers: [SalaryService, ClockifyService, CryptoService],
  controllers: [SalaryController],
})
export class SalaryModule {}
