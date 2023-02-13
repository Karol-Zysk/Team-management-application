import { Controller } from '@nestjs/common';
import { SalaryService } from './salary.service';
import {
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

  @Get('')
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

  @Post(':id')
  geEmployeeSalaryById(
    @GetUser() user: User,
    @Param('id') employeeId: string,
    @Body() dto: SalaryParamsDto,
  ) {
    return this.salaryService.createEmployeeSalaryById(user, dto, employeeId);
  }
}
