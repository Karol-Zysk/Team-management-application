import { Module, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { JwtGuard } from '../auth/guard';
import { CryptoService } from '../cryptography/crypto.service';
import { CryptoModule } from '../cryptography/crypto.module';
import { ClockifyService } from '../clockify/clockify.service';
import { ClockifyModule } from '../clockify/clockify.module';

@UseGuards(JwtGuard)
@Module({
  imports: [CryptoModule, ClockifyModule],
  providers: [EmployeeService, CryptoService, ClockifyService],
  controllers: [EmployeeController],
})
export class EmployeeModule {}
