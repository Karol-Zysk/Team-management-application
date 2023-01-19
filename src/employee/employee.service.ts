import { Injectable, ConflictException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CryptoService } from 'src/cryptography/crypto.service';
import { ClockifyService } from 'src/clockify/clockify.service';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly prisma: PrismaService,
    private cryptoService: CryptoService,
    private clockify: ClockifyService,
  ) {}

  async syncClockifyEmployees(user: User): Promise<any> {
    const employees = await this.clockify.getEmployees(user);

    const employeesData = employees.map((employee) => ({
      clockifyId: employee.id,
      name: employee.name,
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
}
