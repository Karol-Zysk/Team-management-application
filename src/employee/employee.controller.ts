import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorators';
import { JwtGuard } from 'src/auth/guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmployeeService } from './employee.service';

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
  createEmployee(@Body() dto: any, @GetUser() user: User) {
    const employee = this.prisma.employee.create({
      data: {
        email: dto.email,
        name: dto.name,
        user: { connect: { id: user.id } },
      },
    });

    return employee;
  }
}
