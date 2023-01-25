import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ClockifyService } from 'src/clockify/clockify.service';
import { CreateProjectDto, ReportParamsDto, UpdateProjectDto } from './dto';
import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { PrismaService } from 'src/prisma/prisma.service';

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
      const { reportParams, salary } = await this.clockify.projectReport(
        user,
        projectId,
        dto,
      );
      //RETRIEVING AND PROCESSING DATA FROM THE PROJECT OBJECT
      const {
        project,
        members,
        timeEstimate,
        parsedDuration,
        summary,
        budgetEstimate,
      } = reportParams;
      const existingProjectSummary = await this.prisma.project.findUnique({
        where: { projectId: project.id },
      });

      if (existingProjectSummary)
        throw new ForbiddenException(
          'This Project summary already exist. Update existing one',
        );

      const projectSummary = await this.prisma.project.create({
        data: {
          projectName: project.name || dto.projectName,
          duration: parsedDuration,
          projectId: project.id,
          expenses: salary,
          budgetEstimate,
          timeEstimate,
          summary,
          note: dto.note || project.note,
          memberships: members,
          active: !project.archived,
          clientName: project.clientName,
          clientId: project.clientId,
          userId: user.id,
        },
      });

      return projectSummary;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
  async deleteProjectReport(projectId: string) {
    try {
      const report = await this.prisma.project.findFirst({
        where: { projectId },
      });
      if (!report) throw new NotFoundException('Invalid Id');
      await this.prisma.project.delete({
        where: { projectId },
      });
      return 'Deleted';
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
