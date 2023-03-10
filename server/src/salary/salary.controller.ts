import { Controller } from '@nestjs/common';
import { SalaryService } from './salary.service';
import {
  Delete,
  Get,
  Post,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorators';
import { User } from '@prisma/client';
import {
  Param,
  Body,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { SalaryParamsDto } from './dto';
import { EmployeesSalaryReporDto } from '../employee/dto';

@UseGuards(JwtGuard)
@Controller('salary')
export class SalaryController {
  constructor(private salaryService: SalaryService) {}

  @Post('')
  geEmployeesSalary(@GetUser() user: User, @Body() dto: SalaryParamsDto) {
    return this.salaryService.geEmployeesSalary(user, dto);
  }

  @Post('/report')
  employeesSalaryReport(
    @GetUser() user: User,
    @Body() dto: EmployeesSalaryReporDto,
  ) {
    return this.salaryService.employeesSalaryReport(user, dto);
  }

  @Delete('report/:id')
  deleteEmployeeSalaryReport(@Param('id') salaryId: string) {
    return this.salaryService.deleteEmployeeSalaryReport(salaryId);
  }

  @Post(':id')
  async geEmployeeSalaryById(
    @GetUser() user: User,
    @Param('id') employeeId: string,
    @Body() dto: SalaryParamsDto,
  ) {
    const salary = await this.salaryService.createEmployeeSalaryById(
      user,
      dto,
      employeeId,
    );

    return salary;
  }

  @Get()
  getAllEmployeeSalaryReports(@GetUser() user: User) {
    return this.salaryService.getAllEmployeeSalaryReports(user);
  }
}
