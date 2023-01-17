import { Injectable, ConflictException } from '@nestjs/common';
import Clockify from 'clockify-ts';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AES, enc } from 'crypto-js';

@Injectable()
export class EmployeeService {
  private clockify: Clockify;
  constructor(
    private readonly prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async syncClockifyEmployees(user: User): Promise<any> {
    const ciphertext = user.hash_api_key;

    const encryptionKey = this.config.get('ENCRYPTION_KEY');
    const bytes = AES.decrypt(ciphertext, encryptionKey);
    const apiKey = bytes.toString(enc.Utf8);

    this.clockify = new Clockify(apiKey);
    const workspaces = await this.clockify.workspaces.get();
    const workspaceId = workspaces[0].id;

    const employees = await this.clockify.workspaces
      .withId(workspaceId)
      .users.get({});
    const employeesData = employees.map((employee: any) => ({
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
