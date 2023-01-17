import { Module, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { JwtGuard } from 'src/auth/guard';
import { CryptoService } from 'src/cryptography/crypto.service';
import { CryptoModule } from 'src/cryptography/crypto.module';

@UseGuards(JwtGuard)
@Module({
  imports: [CryptoModule],
  providers: [EmployeeService, CryptoService],
  controllers: [EmployeeController],
})
export class EmployeeModule {}
