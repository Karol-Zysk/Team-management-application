import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ClockifyService } from 'src/clockify/clockify.service';
import { SalaryParamsDto } from './dto';
import { EmployeesSalaryReporDto } from 'src/employee/dto';

@Injectable()
export class SalaryService {
  constructor(private clockify: ClockifyService) {}

  async geEmployeesSalary(user: User, dto: SalaryParamsDto) {
    const salary = await this.clockify.geEmployeesSalary(user, dto);
    return salary;
  }
  async geEmployeeSalaryById(
    user: User,
    dto: SalaryParamsDto,
    employeeId: string,
  ) {
    const salary = await this.clockify.geEmployeeSalaryById(
      user,
      dto,
      employeeId,
    );
    return salary;
  }

  employeesSalaryReport(user: User, dto: EmployeesSalaryReporDto) {
    return this.clockify.employeesSalaryReport(user, dto);
  }
}
