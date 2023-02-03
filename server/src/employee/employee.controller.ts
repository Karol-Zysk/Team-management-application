import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorators';
import { JwtGuard } from '../auth/guard';
import { PrismaService } from '../prisma/prisma.service';
import { EmployeeService } from './employee.service';
import {
  CreateEmployeeDto,
  SalaryHistoryInput,
  UpdateEmployeeDto,
} from './dto';
import { Delete, Patch } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';

@UseGuards(JwtGuard)
@Controller('employees')
export class EmployeeController {
  constructor(
    private prisma: PrismaService,
    private employeeService: EmployeeService,
  ) {}
  @Post('syncclockify')
  async syncClockifyEmployees(@GetUser() user: User) {
    return await this.employeeService.syncClockifyEmployees(user);
  }

  @Post()
  createEmployee(@Body() dto: CreateEmployeeDto, @GetUser() user: User) {
    return this.employeeService.createEmployee(dto, user);
  }

  @Patch(':id')
  updateEmployee(
    @Body() dto: UpdateEmployeeDto,
    @GetUser() user: User,
    @Param('id') employeeId: string,
  ) {
    return this.employeeService.updateEmployee(dto, user, employeeId);
  }

  @Get()
  getAllEmployess(@GetUser() user: User) {
    return this.employeeService.getAllEmployess(user);
  }

  @Get(':id')
  getEmployeeById(@GetUser() user: User, @Param('id') id: string) {
    return this.employeeService.getEmployeeById(user, id);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteEmployeeById(@GetUser() user: User, @Param('id') id: string) {
    return this.employeeService.deleteEmployeeById(user, id);
  }

  @Post('salaryhistory/:id')
  addSalaryHistory(@Param('id') id: string, @Body() dto: SalaryHistoryInput) {
    return this.employeeService.addSalaryHistory(id, dto);
  }
}
