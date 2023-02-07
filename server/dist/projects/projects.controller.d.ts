import { ProjectsService } from './projects.service';
import { User } from '@prisma/client';
import { CreateProjectDto, ReportParamsDto, UpdateReportDto, UpdateProjectDto } from './dto';
export declare class ProjectsController {
    private projectsservice;
    constructor(projectsservice: ProjectsService);
    getProjects(user: User): Promise<import("clockify-ts/dist/cjs/Types/ProjectType").ProjectType[]>;
    getProjectsById(user: User, projectId: string): Promise<import("clockify-ts/dist/cjs/Types/ProjectType").ProjectType>;
    createProject(user: User, payload: CreateProjectDto): Promise<import("clockify-ts/dist/cjs/Types/ProjectType").ProjectType>;
    updateProject(user: User, payload: UpdateProjectDto, projectId: string): Promise<import("clockify-ts/dist/cjs/Types/ProjectType").ProjectType>;
    deleteProject(user: User, projectId: string): Promise<void>;
    projectReport(user: User, projectId: string, dto: ReportParamsDto): Promise<import(".prisma/client").Project>;
    deleteProjectReport(projectId: string): Promise<void>;
    updateProjectReport(projectId: string, dto: UpdateReportDto, user: User): Promise<import(".prisma/client").Project>;
}
