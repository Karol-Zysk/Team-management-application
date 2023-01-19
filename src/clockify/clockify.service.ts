import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import Clockify from 'clockify-ts';
import { CryptoService } from 'src/cryptography/crypto.service';
import { CreateProjectDto, UpdateProjectDto } from 'src/projects/dto';

@Injectable()
export class ClockifyService {
  private clockify: Clockify;

  constructor(private cryptoService: CryptoService) {}

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
}
