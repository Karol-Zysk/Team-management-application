import { Module, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Module({
  providers: [EmployeeService],
  controllers: [EmployeeController],
})
export class EmployeeModule {}
