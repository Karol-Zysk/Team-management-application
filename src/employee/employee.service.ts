import { Injectable, ForbiddenException } from '@nestjs/common';
import Clockify from 'clockify-ts';
import { Employee, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class EmployeeService {
  private clockify: Clockify;
  constructor(private readonly prisma: PrismaService) {}

  async syncClockifyEmployees(user: User): Promise<any> {
    this.clockify = new Clockify(
      'OWY1ZTBjMWUtMGI3Ni00YmE1LTllMWYtZjA0YWQwOTYyODg0',
    );
    const workspaceId = '63bdb6b7a938f743f92ac760';

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
        await this.prisma.employee.create({ data: { ...employee } });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException(`${error.meta.target} duplicated`);
          }
        }
        throw error;
      }
    }
  }
}
