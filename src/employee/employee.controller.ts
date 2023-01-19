import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorators';
import { JwtGuard } from 'src/auth/guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto';
import { Delete } from '@nestjs/common/decorators';

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
