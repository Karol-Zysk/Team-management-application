import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import Clockify from 'clockify-ts';
import { CryptoService } from 'src/cryptography/crypto.service';
import { EmployeesSalaryReporDto } from 'src/employee/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateProjectDto,
  UpdateProjectDto,
  ReportParamsDto,
} from 'src/projects/dto';
import { SalaryParamsDto } from 'src/salary/dto';
import {
  getDatesForMonth,
  projectReportConstans,
  getHoursWorked,
} from 'src/utils';

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
  }

  async getEmployees(user: User) {
    try {
      await this.initClockify(user);
      const workspaces = await this.clockify.workspaces.get();

      const employees = await this.clockify.workspaces
        .withId(workspaces[0].id)
        .users.get({});

      return employees;
    } catch (error) {
      throw new UnauthorizedException('Invalid Api key');
    }
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
  async calculateSalary(
    clockifyId: string,
    user: User,
    dto?: any,
    date?: { start: Date; end: Date },
  ) {
    await this.initClockify(user);

    const options = { clockifyId, dto, date };
    const hours = await getHoursWorked.bind(this)(options);

    const { hourlyRate } = await this.prisma.employee.findFirst({
      where: { clockifyId: clockifyId, userId: user.id },
    });

    const salary = hours * hourlyRate;

    await this.prisma.employee.updateMany({
      where: { clockifyId: clockifyId, userId: user.id },
      data: { hoursWorked: hours, salary },
    });

    return await this.prisma.employee.findFirst({
      where: { clockifyId: clockifyId, userId: user.id },
    });
  }

  async geEmployeesSalary(user: User, dto: SalaryParamsDto) {
    try {
      const employees = await this.prisma.employee.findMany({
        where: { userId: user.id },
        select: { id: true, clockifyId: true },
      });
      const clockifyIds = employees.map((employee) => employee.clockifyId);

      let date: { start: Date; end: Date };
      if (dto.date) date = getDatesForMonth(dto.date);

      for (const clockifyId of clockifyIds) {
        if (!clockifyId) continue;
        this.calculateSalary(clockifyId, user, dto, date);
      }

      return this.prisma.employee.findMany({
        where: { userId: user.id },
      });
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async geEmployeeSalaryById(
    user: User,
    dto: SalaryParamsDto,
    employeeId: string,
  ) {
    try {
      let date: { start: Date; end: Date };
      if (dto.date) date = getDatesForMonth(dto.date);
      return this.calculateSalary(employeeId, user, dto, date);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async projectReport(user: User, projectId: string, dto: ReportParamsDto) {
    try {
      await this.initClockify(user);

      const employees = await this.prisma.employee.findMany({
        where: { userId: user.id },
        select: { id: true, clockifyId: true },
      });
      const clockifyIds = employees.map((employee) => employee.clockifyId);

      for (const clockifyId of clockifyIds) {
        const options = { clockifyId, dto, projectId };
        if (clockifyId === null) continue;

        //CALCULATING ALL CLOCKIFY USERS WORKING HOURS
        const hours = await getHoursWorked.bind(this)(options);
        const { hourlyRate } = await this.prisma.employee.findFirst({
          where: { clockifyId: clockifyId, userId: user.id },
        });

        const salary = hours * hourlyRate;

        await this.prisma.employee.updateMany({
          where: { clockifyId: clockifyId, userId: user.id },
          data: { hoursWorked: hours, salary },
        });
      }
      //CALCULATING THE TOTAL PAYROLL FOR ALL EMPLOYEES FOR A GIVEN PROJECT USING AGGREGATION
      const totalSalary = await this.prisma.employee.aggregate({
        where: { userId: user.id },
        _sum: { salary: true },
      });
      const {
        _sum: { salary },
      } = totalSalary;
      //RETRIEVING AND PROCESSING DATA FROM THE PROJECT OBJECT
      const reportParams = await projectReportConstans.bind(this)({
        projectId,
        dto,
        salary,
      });

      return { reportParams, salary };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
  async employeesSalaryReport(user: User, dto: EmployeesSalaryReporDto) {
    const salary = await this.geEmployeesSalary(user, dto);
    const employeesSalary = salary.map((data) => {
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

    try {
      const report = await this.prisma.report.create({
        data: {
          reportName: `Software Partner report ${
            dto.date ? dto.date : dto.start + ' ' + dto.end
          }`,
          userId: user.id,
          employees: employeesSalary,
        },
      });
      return report;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
