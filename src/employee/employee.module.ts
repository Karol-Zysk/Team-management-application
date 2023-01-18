import { Module, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { JwtGuard } from 'src/auth/guard';
import { CryptoService } from 'src/cryptography/crypto.service';
import { CryptoModule } from 'src/cryptography/crypto.module';
import { ClockifyService } from 'src/clockify/clockify.service';
import { ClockifyModule } from 'src/clockify/clockify.module';

@UseGuards(JwtGuard)
@Module({
  imports: [CryptoModule, ClockifyModule],
  providers: [EmployeeService, CryptoService, ClockifyService],
  controllers: [EmployeeController],
})
export class EmployeeModule {}
