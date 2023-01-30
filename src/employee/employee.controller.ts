import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorators';
import { JwtGuard } from '../auth/guard';
import { PrismaService } from '../prisma/prisma.service';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto';
import { Delete, Patch } from '@nestjs/common/decorators';

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

  @Delete(':id')
  deleteEmployeeById(@GetUser() user: User, @Param('id') id: string) {
    return this.employeeService.deleteEmployeeById(user, id);
  }
}
