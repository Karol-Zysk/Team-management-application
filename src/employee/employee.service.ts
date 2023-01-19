import { Injectable, ConflictException } from '@nestjs/common';
import { User } from '@prisma/client';
import { ClockifyService } from 'src/clockify/clockify.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmployeeDto } from './dto';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly prisma: PrismaService,
    private clockify: ClockifyService,
  ) {}

  async syncClockifyEmployees(user: User): Promise<any> {
    const employees = await this.clockify.getEmployees(user);

    const employeesData = employees.map((employee) => ({
      clockifyId: employee.id,
      clockifyName: employee.name,
      email: employee.email,
      profilePicture: employee.profilePicture,
      userId: user.id,
    }));

    for (const employee of employeesData) {
      try {
        const existingEmployees = await this.prisma.employee.findMany({
          where: { clockifyId: employee.clockifyId, userId: user.id },
        });
        if (!existingEmployees.length) {
          await this.prisma.employee.create({ data: { ...employee } });
        } else {
          throw new ConflictException('duplicated users finded');
        }
      } catch (error) {
        throw error;
      }
    }
  }
  async createEmployee(dto: CreateEmployeeDto, user: User) {
    const employee = await this.prisma.employee.create({
      data: {
        ...dto,
        user: { connect: { id: user.id } },
      },
    });
    return employee;
  }
}
