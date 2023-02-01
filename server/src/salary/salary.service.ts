import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ClockifyService } from '../clockify/clockify.service';
import { SalaryParamsDto } from './dto';
import { EmployeesSalaryReporDto } from '../employee/dto';
import { BadRequestException } from '@nestjs/common/exceptions';

@Injectable()
export class SalaryService {
  constructor(private clockify: ClockifyService) {}

  async geEmployeesSalary(user: User, dto: SalaryParamsDto) {
    const salary = await this.clockify.geEmployeesSalary(user, dto);
    return salary;
  }

  employeesSalaryReport(user: User, dto: EmployeesSalaryReporDto) {
    return this.clockify.employeesSalaryReport(user, dto);
  }

  async geEmployeeSalaryById(
    user: User,
    dto: SalaryParamsDto,
    employeeId: string,
  ) {
    try {
      const salary = await this.clockify.geEmployeeSalaryById(
        user,
        dto,
        employeeId,
      );
      return salary;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
