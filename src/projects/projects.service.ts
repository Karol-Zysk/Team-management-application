import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ClockifyService } from 'src/clockify/clockify.service';
import { CreateProjectDto, UpdateProjectDto } from './dto';
import { HttpStatusCode } from 'axios';
import { UnauthorizedException } from '@nestjs/common/exceptions';

@Injectable()
export class ProjectsService {
  constructor(private clockify: ClockifyService) {}

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
}
