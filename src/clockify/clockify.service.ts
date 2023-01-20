import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import Clockify from 'clockify-ts';
import { CryptoService } from 'src/cryptography/crypto.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from 'src/projects/dto';
import { SalaryParamsDto } from 'src/salary/dto';

@Injectable()
export class ClockifyService {
  private clockify: Clockify;

  constructor(
    private cryptoService: CryptoService,
    private prisma: PrismaService,
  ) {}

  private async initClockify(user: User) {
    if (!user.hash_api_key)
      throw new ForbiddenException('Set up clockify apiKey first');
    const apiKey = this.cryptoService.decrypt(user.hash_api_key);
    this.clockify = new Clockify(apiKey);
  }

  async getEmployees(user: User) {
    await this.initClockify(user);
    const workspaces = await this.clockify.workspaces.get();

    const employees = await this.clockify.workspaces
      .withId(workspaces[0].id)
      .users.get({});

    return employees;
  }

  async getAllProjects(user: User) {
    await this.initClockify(user);
    const workspaces = await this.clockify.workspaces.get();

    const projects = await this.clockify.workspace
      .withId(workspaces[0].id)
      .projects.get();

    return projects;
  }
  async getProjectById(user: User, projectId: string) {
    await this.initClockify(user);
    const workspaces = await this.clockify.workspaces.get();

    const project = await this.clockify.workspace
      .withId(workspaces[0].id)
      .projects.withId(projectId)
      .get();

    return project;
  }
  async createProject(user: User, dto: CreateProjectDto) {
    await this.initClockify(user);
    const workspaces = await this.clockify.workspaces.get();

    const project = await this.clockify.workspace
      .withId(workspaces[0].id)
      .projects.post({
        name: dto.name,
        note: dto.note,
      });

    return project;
  }
  async updateProject(user: User, dto: UpdateProjectDto, projectId: string) {
    await this.initClockify(user);
    const workspaces = await this.clockify.workspaces.get();

    const updatedProject = await this.clockify.workspace
      .withId(workspaces[0].id)
      .projects.withId(projectId)
      .put({ ...dto });

    return updatedProject;
  }
  async deleteProject(user: User, projectId: string) {
    await this.initClockify(user);
    const workspaces = await this.clockify.workspaces.get();

    await this.clockify.workspace
      .withId(workspaces[0].id)
      .projects.withId(projectId)
      .delete();
    return;
  }
  async geEmployeeSalary(user: User, employeeId: string, dto: SalaryParamsDto) {
    await this.initClockify(user);
    const workspaces = await this.clockify.workspaces.get();

    // Retrieve all clockifyIds for the employees of this user
    const employees = await this.prisma.employee.findMany({
      where: { userId: user.id },
      select: { id: true, clockifyId: true },
    });
    const clockifyIds = employees.map((employee) => employee.clockifyId);
    for (const clockifyId of clockifyIds) {
      // Retrieve time entries for the selected employee
      const timeEntries = await this.clockify.workspace
        .withId(workspaces[0].id)
        .users.withId(clockifyId)
        .timeEntries.get({
          ...dto,
          start: new Date(dto.start),
          end: new Date(dto.end),
        });

      let totalWorkingTime = 0;
      timeEntries.forEach((timeEntry) => {
        const start = new Date(timeEntry.timeInterval.start).getTime();
        const end = new Date(timeEntry.timeInterval.end).getTime();
        const workingTime = end - start;
        totalWorkingTime += workingTime;
      });
      // Calculate total working time in hours
      const hours = Number((totalWorkingTime / (1000 * 60 * 60)).toFixed(1));

      // Update the workhours column for the corresponding employee
      await this.prisma.employee.updateMany({
        where: { clockifyId: clockifyId, userId: user.id },
        data: { hoursWorked: hours },
      });
    }
    return;
  }
}
