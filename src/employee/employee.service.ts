import {
  Injectable,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
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

    for (const employee of employees) {
      try {
        const existingEmployees = await this.prisma.employee.findMany({
          where: { clockifyId: employee.id, userId: user.id },
        });
        if (!existingEmployees.length) {
          await this.prisma.employee.create({
            data: {
              clockifyId: employee.id,
              email: employee.email,
              clockifyName: employee.name,
              profilePicture: employee.profilePicture,
              userId: user.id,
            },
          });
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
  async getAllEmployess(user: User) {
    const employees = await this.prisma.employee.findMany({
      where: {
        userId: user.id,
      },
    });
    return employees;
  }
  async getEmployeeById(user: User, employeeId: string) {
    try {
      const employee = await this.prisma.employee.findUnique({
        where: {
          id: employeeId,
        },
      });

      if (employee.userId !== user.id) {
        throw new BadRequestException('Invalid User Id');
      }

      return employee;
    } catch (error) {
      throw new BadRequestException('Invalid id');
    }
  }
  async deleteEmployeeById(user: User, employeeId: string) {
    try {
      const employee = await this.prisma.employee.deleteMany({
        where: {
          id: employeeId,
          userId: user.id,
        },
      });
      if (employee.count === 0) {
        throw new BadRequestException('Invalid User Id');
      }
      return 'Successfuly deleted';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
