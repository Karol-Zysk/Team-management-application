import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ClockifyService } from 'src/clockify/clockify.service';
import { SalaryParamsDto } from './dto';

@Injectable()
export class SalaryService {
  constructor(private clockify: ClockifyService) {}

  async geEmployeeSalary(user: User, employeeId: string, dto: SalaryParamsDto) {
    const salary = await this.clockify.geEmployeeSalary(user, employeeId, dto);
    return salary;
  }
}
