import { Controller, Get, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { User } from '@prisma/client';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorators';
import {
  Body,
  Param,
  Post,
  Patch,
  Delete,
  HttpCode,
} from '@nestjs/common/decorators';
import {
  CreateProjectDto,
  ReportParamsDto,
  UpdateReportDto,
  UpdateProjectDto,
} from './dto';
import { HttpStatus } from '@nestjs/common/enums';

@UseGuards(JwtGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  async getProjects(@GetUser() user: User) {
    return this.projectsService.getProjects(user);
  }

  @Get(':projectId')
  async getProjectsById(
    @GetUser() user: User,
    @Param('projectId') projectId: string,
  ) {
    return this.projectsService.getProjectsById(user, projectId);
  }

  @Post('')
  async createProject(
    @GetUser() user: User,
    @Body() payload: CreateProjectDto,
  ) {
    return this.projectsService.createProject(user, payload);
  }

  @Patch(':id')
  async updateProject(
    @GetUser() user: User,
    @Body() payload: UpdateProjectDto,
    @Param('id') projectId: string,
  ) {
    return this.projectsService.updateProject(user, payload, projectId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteProject(@GetUser() user: User, @Param('id') projectId: string) {
    return this.projectsService.deleteProject(user, projectId);
  }

  @Post('report/:id')
  async projectReport(
    @GetUser() user: User,
    @Param('id') projectId: string,
    @Body() dto: ReportParamsDto,
  ) {
    return this.projectsService.createProjectReport(user, projectId, dto);
  }

  @Delete('report/:id')
  async deleteProjectReport(@Param('id') projectId: string) {
    return this.projectsService.deleteProjectReport(projectId);
  }

  @Patch('report/:id')
  async updateProjectReport(
    @Param('id') projectId: string,
    @Body() dto: UpdateReportDto,
    @GetUser() user: User,
  ) {
    return this.projectsService.updateProjectReport(projectId, dto, user);
  }
}
