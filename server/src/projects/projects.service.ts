import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ClockifyService } from '../clockify/clockify.service';
import {
  CreateProjectDto,
  ReportParamsDto,
  UpdateProjectDto,
  UpdateReportDto,
} from './dto';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(
    private clockify: ClockifyService,
    private prisma: PrismaService,
  ) {}

  async getProjects(user: User) {
    try {
      const projects = await this.clockify.getAllProjects(user);
      return projects;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async getProjectsById(user: User, projectId: string) {
    try {
      const project = await this.clockify.getProjectById(user, projectId);
      return project;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async createProject(user: User, dto: CreateProjectDto) {
    try {
      const project = await this.clockify.createProject(user, dto);
      return project;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async updateProject(user: User, dto: UpdateProjectDto, projectId: string) {
    try {
      const project = await this.clockify.updateProject(user, dto, projectId);
      return project;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async deleteProject(user: User, projectId: string) {
    try {
      await this.clockify.deleteProject(user, projectId);

      return;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async createProjectReport(
    user: User,
    projectId: string,
    dto: ReportParamsDto,
  ) {
    try {
      const {
        project,
        timeEstimate,
        parsedDuration,
        summary,
        budgetEstimate,
        salary,
        date,
        workspaceId,
      } = await this.clockify.projectReport(user, projectId, dto);

      const projectMembers = await this.prisma.employee.findMany({
        where: {
          AND: [{ userId: user.id, workspaceId }, { hoursWorked: { not: 0 } }],
        },
        select: {
          clockifyId: true,
          clockifyName: true,
          hoursWorked: true,
          hourlyRate: true,
          salary: true,
          profilePicture: true,
        },
      });

      const member = projectMembers.map((member) => {
        return member;
      });

      const projectSummary = await this.prisma.project.create({
        data: {
          projectName: `${user.companyName}, Project: ${project.name}`,
          duration: parsedDuration,
          projectId: project.id,
          expenses: salary,
          budgetEstimate,
          timeEstimate,
          summary,
          workspaceId,
          note: dto.note || project.note,
          memberships: member,
          active: !project.archived,
          clientName: project.clientName,
          clientId: project.clientId,
          userId: user.id,
          projectStartDate: date.start,
        },
      });

      return projectSummary;
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async deleteProjectReport(projectId: string) {
    try {
      const report = await this.prisma.project.findFirst({
        where: { id: projectId },
      });
      if (!report) throw new NotFoundException('Invalid Id');
      await this.prisma.project.delete({
        where: { id: projectId },
      });
      return;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
  async getAllProjectReports(user: User) {
    return this.clockify.getAllProjectReports(user);
  }

  async updateProjectReport(
    projectId: string,
    dto: UpdateReportDto,
    user: User,
  ) {
    try {
      const totalSalary = await this.prisma.employee.aggregate({
        where: { userId: user.id },
        _sum: { salary: true },
      });
      const {
        _sum: { salary },
      } = totalSalary;

      const project = await this.prisma.project.findFirst({
        where: { projectId },
      });
      if (!project) throw new NotFoundException('Invalid Id');

      const budgetEstimate = dto.budgetEstimate || project.budgetEstimate;
      const timeEstimate = dto.timeEstimate || project.timeEstimate;
      const summary = budgetEstimate - salary;

      const report = await this.prisma.project.update({
        where: { id: project.id },
        data: {
          projectName: dto.projectName,
          budgetEstimate,
          timeEstimate,
          expenses: salary,
          summary,
          note: dto.note,
        },
      });

      return report;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
