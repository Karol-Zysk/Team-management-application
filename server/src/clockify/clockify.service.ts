import {
  ForbiddenException,
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import Clockify from 'clockify-ts';
import { CryptoService } from '../cryptography/crypto.service';
import { EmployeesSalaryReporDto } from '../employee/dto';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProjectDto,
  UpdateProjectDto,
  ReportParamsDto,
} from '../projects/dto';
import { SalaryParamsDto } from '../salary/dto';
import {
  getDatesForMonth,
  projectReportConstans,
  getHoursWorked,
} from '../utils';

@Injectable()
export class ClockifyService {
  private clockify: Clockify;

  constructor(
    private cryptoService: CryptoService,
    private prisma: PrismaService,
  ) {}

  async initClockify(user: User) {
    if (!user.hash_api_key)
      throw new ForbiddenException('Set up clockify apiKey first');
    const apiKey = this.cryptoService.decrypt(user.hash_api_key);
    this.clockify = new Clockify(apiKey);
    const workspaces = await this.clockify.workspaces.get();
    const workspaceId = workspaces[0].id;
    return { workspaceId };
  }

  async getEmployees(user: User) {
    try {
      const { workspaceId } = await this.initClockify(user);

      const employees = await this.clockify.workspaces
        .withId(workspaceId)
        .users.get({});

      return { employees, workspaceId };
    } catch (error) {
      throw new UnauthorizedException('Invalid Api key');
    }
  }

  async getAllProjects(user: User) {
    const { workspaceId } = await this.initClockify(user);

    const projects = await this.clockify.workspace
      .withId(workspaceId)
      .projects.get();

    return projects;
  }

  async getProjectById(user: User, projectId: string) {
    const { workspaceId } = await this.initClockify(user);

    const project = await this.clockify.workspace
      .withId(workspaceId)
      .projects.withId(projectId)
      .get();

    return project;
  }

  async createProject(user: User, dto: CreateProjectDto) {
    const { workspaceId } = await this.initClockify(user);

    const project = await this.clockify.workspace
      .withId(workspaceId)
      .projects.post({
        name: dto.name,
        note: dto.note,
      });

    return project;
  }

  async updateProject(user: User, dto: UpdateProjectDto, projectId: string) {
    const { workspaceId } = await this.initClockify(user);

    const updatedProject = await this.clockify.workspace
      .withId(workspaceId)
      .projects.withId(projectId)
      .put({ ...dto });

    return updatedProject;
  }

  async deleteProject(user: User, projectId: string) {
    const { workspaceId } = await this.initClockify(user);

    await this.clockify.workspace
      .withId(workspaceId)
      .projects.withId(projectId)
      .delete();
    return;
  }

  async calculateSalary(
    clockifyId: string,
    user: User,
    dto?: any,
    date?: { start: Date; end: Date },
    workspaceId?: string,
  ) {
    const options = { clockifyId, dto, date, workspaceId };

    const hours = await getHoursWorked.bind(this)(options);

    let hourlyRate;
    const employee = await this.prisma.employee.findFirst({
      where: { clockifyId: clockifyId, userId: user.id },
      select: {
        salaryHistory: true,
        hourlyRate: true,
      },
    });

    if (date) {
      const salaryHistory = employee.salaryHistory.find(
        (salary) => date.start >= salary.start && date.start < salary.end,
      );
      hourlyRate = salaryHistory
        ? salaryHistory.hourlyRate
        : employee.hourlyRate;
    } else {
      hourlyRate = employee.hourlyRate;
    }

    const salary = hours * hourlyRate;
    await this.prisma.employee.updateMany({
      where: { clockifyId: clockifyId, userId: user.id },
      data: { hoursWorked: hours, hourlyRate, salary },
    });

    return await this.prisma.employee.findFirst({
      where: { clockifyId: clockifyId, userId: user.id },
    });
  }

  async geEmployeesSalary(user: User, dto: SalaryParamsDto) {
    try {
      const { workspaceId } = await this.initClockify(user);
      const employees = await this.prisma.employee.findMany({
        where: { userId: user.id, workspaceId },
        select: { id: true, clockifyId: true, email: true },
      });

      const clockifyIds = employees.map((employee) => employee.clockifyId);

      let date: { start: Date; end: Date };

      if (dto.date) {
        date = getDatesForMonth(dto.date);
      }
      if (dto.start && dto.end) {
        date = {
          start:
            new Date(Date.parse(dto.start)) ||
            new Date(Date.parse('01.01.2015')),
          end: new Date(Date.parse(dto.end)) || new Date(Date.now()),
        };
      } else {
        date = {
          start: new Date(Date.parse('01.01.2015')),
          end: new Date(Date.now()),
        };
      }

      const promises = [];
      for (let i = 0; i < clockifyIds.length; i++) {
        const clockifyId = clockifyIds[i];
        promises.push(
          new Promise((resolve) => {
            setTimeout(async () => {
              const result = await this.calculateSalary(
                clockifyId,
                user,
                dto,
                date,
                workspaceId,
              );
              resolve(result);
            }, i * 100);
          }),
        );
      }

      await Promise.all(promises);

      const employeesWithSalary = await this.prisma.employee.findMany({
        where: { userId: user.id, workspaceId },
      });
      return { employeesWithSalary, workspaceId };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createEmployeeSalaryById(
    user: User,
    dto: SalaryParamsDto,
    employeeId: string,
  ) {
    try {
      const { workspaceId } = await this.initClockify(user);

      let date: { start: Date; end: Date };
      if (dto.date) date = getDatesForMonth(dto.date);
      return this.calculateSalary(employeeId, user, dto, date, workspaceId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async projectReport(user: User, projectId: string, dto: ReportParamsDto) {
    try {
      const { workspaceId } = await this.initClockify(user);
      let date: { start: Date; end: Date };
      if (!dto.end) {
        date = {
          start: new Date(Date.parse(dto.start)),
          end: new Date(Date.now()),
        };
      } else {
        date = {
          start: new Date(Date.parse(dto.start)),
          end: new Date(Date.parse(dto.end)),
        };
      }

      const employees = await this.prisma.employee.findMany({
        where: { userId: user.id, workspaceId },
        select: { id: true, clockifyId: true },
      });
      const clockifyIds = employees.map((employee) => employee.clockifyId);

      if (employees.length === 0)
        throw new BadRequestException('Sync Employees First');
      for (const clockifyId of clockifyIds) {
        const options = { clockifyId, dto, date, workspaceId, projectId };

        //CALCULATING ALL CLOCKIFY USERS WORKING HOURS
        const hours = await getHoursWorked.bind(this)(options);
        let hourlyRate;
        const employee = await this.prisma.employee.findFirst({
          where: { clockifyId: clockifyId, userId: user.id, workspaceId },
          select: {
            salaryHistory: true,
            hourlyRate: true,
          },
        });

        if (date) {
          const salaryHistory = employee.salaryHistory.find(
            (salary) => date.start >= salary.start && date.start < salary.end,
          );
          hourlyRate = salaryHistory
            ? salaryHistory.hourlyRate
            : employee.hourlyRate;
        } else {
          hourlyRate = employee.hourlyRate;
        }

        const salary = hours * hourlyRate;

        await this.prisma.employee.updateMany({
          where: { clockifyId: clockifyId, userId: user.id, workspaceId },
          data: {
            hoursWorked: hours,
            salary: salary ? Number(salary.toFixed(1)) : 0,
          },
        });
      }
      const totalSalary = await this.prisma.employee.aggregate({
        where: { userId: user.id, workspaceId },
        _sum: { salary: true },
      });
      const {
        _sum: { salary },
      } = totalSalary;

      const reportParams = await projectReportConstans.bind(this)({
        projectId,
        dto,
        salary,
        workspaceId,
      });

      return { ...reportParams, salary, date, workspaceId };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async employeesSalaryReport(user: User, dto: EmployeesSalaryReporDto) {
    const { workspaceId, employeesWithSalary } = await this.geEmployeesSalary(
      user,
      dto,
    );
    const employeesSalary = employeesWithSalary.map((data) => {
      const {
        firstName,
        lastName,
        email,
        clockifyName,
        hourlyRate,
        hoursWorked,
        salary,
      } = data;

      return {
        firstName,
        lastName,
        email,
        clockifyName,
        hourlyRate,
        hoursWorked,
        salary,
      };
    });
    const reportName = `${user.companyName}. ${
      dto.start && dto.end
        ? `Period: ${dto.start} to ${dto.end}`
        : 'Unknown time period'
    }`;
    try {
      const report = await this.prisma.report.create({
        data: {
          reportName,
          workspaceId,
          userId: user.id,
          employees: employeesSalary,
        },
      });
      return report;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async getAllProjectReports(user: User) {
    try {
      const { workspaceId } = await this.initClockify(user);

      const projectReports = await this.prisma.project.findMany({
        where: { userId: user.id, workspaceId },
      });

      return projectReports;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllEmployeeSalaryReports(user: User) {
    try {
      const { workspaceId } = await this.initClockify(user);
      const salaryReports = await this.prisma.report.findMany({
        where: { userId: user.id, workspaceId },
      });

      return salaryReports;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
