import { Injectable, ConflictException } from '@nestjs/common';
import Clockify from 'clockify-ts';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AES, enc } from 'crypto-js';
import { CryptoService } from 'src/cryptography/crypto.service';

@Injectable()
export class EmployeeService {
  private clockify: Clockify;
  constructor(
    private readonly prisma: PrismaService,
    private config: ConfigService,
    private cryptoService: CryptoService,
  ) {}

  async syncClockifyEmployees(user: User): Promise<any> {
    const apiKey = this.cryptoService.decrypt(user.hash_api_key);

    this.clockify = new Clockify(apiKey);
    const workspaces = await this.clockify.workspaces.get();
    const workspaceId = workspaces[0].id;

    const employees = await this.clockify.workspaces
      .withId(workspaceId)
      .users.get({});
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
