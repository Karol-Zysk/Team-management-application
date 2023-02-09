import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { ClockifyService } from '../clockify/clockify.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateEmployeeDto,
  SalaryHistoryInput,
  UpdateEmployeeDto,
} from './dto';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly prisma: PrismaService,
    private clockify: ClockifyService,
  ) {}

  async syncClockifyEmployees(user: User): Promise<any> {
    const { employees, workspaceId } = await this.clockify.getEmployees(user);

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
              workspaceId,
            },
          });
        } else {
          continue;
        }
        await this.prisma.user.update({
          where: { id: user.id },
          data: { sync: true },
        });
        return;
      } catch (error) {
        throw error;
      }
    }
    return await this.prisma.employee.findMany({
      where: {
        userId: user.id,
        workspaceId,
      },
    });
  }

  async createEmployee(dto: CreateEmployeeDto, user: User) {
    const hourlyRate = dto.hourlyRate || 0;
    const hoursWorked = 0;

    try {
      const { employees, workspaceId } = await this.clockify.getEmployees(user);
      const employeeId = employees.find((e) => e.id === dto.clockifyId);
      if (!employeeId)
        throw new NotFoundException(
          `There is no employee with clockifyId: ${dto.clockifyId} in your workspace`,
        );

      const existingClockifyId = await this.prisma.employee.findMany({
        where: {
          userId: user.id,
        },
        select: {
          clockifyId: true,
        },
      });

      const existingId = existingClockifyId.find(
        (e) => e.clockifyId === dto.clockifyId,
      );

      if (existingId)
        throw new ConflictException(
          'User with this clockifyId or email already exist',
        );

      const existingEmployee = await this.prisma.employee.findFirst({
        where: {
          userId: user.id,
          email: dto.email,
        },
      });
      if (existingEmployee)
        throw new ConflictException(
          'User elo with this clockifyId or email already exist',
        );

      const employee = await this.prisma.employee.create({
        data: {
          ...dto,
          salary: hourlyRate * hoursWorked,
          user: { connect: { id: user.id } },
          workspaceId,
        },
      });
      return employee;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateEmployee(dto: UpdateEmployeeDto, user: User, employeeId: string) {
    try {
      const { employees, workspaceId } = await this.clockify.getEmployees(user);
      const existingEmployee = await this.prisma.employee.findUnique({
        where: { id: employeeId },
      });
      if (!existingEmployee) throw new NotFoundException('Invalid User Id');
      const duplicateEmail = employees.find((e) => e.email === dto.email);
      if (duplicateEmail)
        throw new NotFoundException(
          `This email is already taken by user in your workspace`,
        );
      const { hourlyRate, hoursWorked } = await this.prisma.employee.findUnique(
        {
          where: { id: employeeId },
          select: { hourlyRate: true, hoursWorked: true },
        },
      );

      const salary = (dto.hourlyRate || hourlyRate) * hoursWorked;
      await this.prisma.employee.updateMany({
        where: { id: employeeId, workspaceId, userId: user.id },
        data: {
          ...dto,
          salary,
        },
      });

      return 'Updated';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllEmployess(user: User) {
    const { workspaceId } = await this.clockify.getEmployees(user);
    const employees = await this.prisma.employee.findMany({
      where: {
        userId: user.id,
        workspaceId,
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

      if (employee.userId !== user.id)
        throw new BadRequestException('Invalid User Id');

      return employee;
    } catch (error) {
      throw new BadRequestException(error.message);
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
      return;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async addSalaryHistory(employeeId: string, dto: SalaryHistoryInput) {
    try {
      const employee = await this.prisma.employee.findUnique({
        where: { id: employeeId },
      });

      if (!employee) {
        throw new Error('Employee not found');
      }
      const newSalaryHistory = await this.prisma.salaryHistory.create({
        data: {
          start: new Date(dto.start),
          end: new Date(dto.end),
          hourlyRate: dto.hourlyRate,
          Employee: {
            connect: { id: employee.id },
          },
        },
      });

      return newSalaryHistory;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
