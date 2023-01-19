import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ClockifyService } from 'src/clockify/clockify.service';
import { CreateProjectDto, UpdateProjectDto } from './dto';

@Injectable()
export class ProjectsService {
  constructor(private clockify: ClockifyService) {}

  async getProjects(user: User) {
    const projects = await this.clockify.getAllProjects(user);
    return projects;
  }
  async getProjectsById(user: User, projectId: string) {
    try {
      const project = await this.clockify.getProjectById(user, projectId);
      return project;
    } catch (error) {
      throw new BadRequestException('No projects with this Id');
    }
  }
  async createProject(user: User, dto: CreateProjectDto) {
    try {
      const project = await this.clockify.createProject(user, dto);
      return project;
    } catch (error) {
      throw new BadRequestException('No projects with this Id');
    }
  }
  async updateProject(user: User, dto: UpdateProjectDto, projectId: string) {
    try {
      const project = await this.clockify.updateProject(user, dto, projectId);
      return project;
    } catch (error) {
      throw new BadRequestException('No projects with this Id');
    }
  }
  async deleteProject(user: User, projectId: string) {
    try {
      return await this.clockify.deleteProject(user, projectId);
    } catch (error) {
      throw new BadRequestException('Project already doesent exist');
    }
  }
}
