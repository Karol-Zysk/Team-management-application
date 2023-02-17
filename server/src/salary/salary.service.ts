import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ClockifyService } from '../clockify/clockify.service';
import { SalaryParamsDto } from './dto';
import { EmployeesSalaryReporDto } from '../employee/dto';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SalaryService {
  constructor(
    private clockify: ClockifyService,
    private prisma: PrismaService,
  ) {}

  async geEmployeesSalary(user: User, dto: SalaryParamsDto) {
    const salary = await this.clockify.geEmployeesSalary(user, dto);
    return salary;
  }

  employeesSalaryReport(user: User, dto: EmployeesSalaryReporDto) {
    return this.clockify.employeesSalaryReport(user, dto);
  }

  async createEmployeeSalaryById(
    user: User,
    dto: SalaryParamsDto,
    employeeId: string,
  ) {
    try {
      const salary = await this.clockify.createEmployeeSalaryById(
        user,
        dto,
        employeeId,
      );

      return salary;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllEmployeeSalaryReports(user: User) {
    return this.clockify.getAllEmployeeSalaryReports(user);
  }

  async deleteEmployeeSalaryReport(salaryId: string) {
    try {
      const report = await this.prisma.report.findFirst({
        where: { id: salaryId },
      });
      if (!report) throw new NotFoundException('Invalid Id');
      await this.prisma.report.delete({
        where: { id: salaryId },
      });
      return;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
