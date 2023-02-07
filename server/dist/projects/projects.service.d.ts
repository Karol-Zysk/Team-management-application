import { User } from '@prisma/client';
import { ClockifyService } from '../clockify/clockify.service';
import { CreateProjectDto, ReportParamsDto, UpdateProjectDto, UpdateReportDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class ProjectsService {
    private clockify;
    private prisma;
    constructor(clockify: ClockifyService, prisma: PrismaService);
    getProjects(user: User): Promise<import("clockify-ts/dist/cjs/Types/ProjectType").ProjectType[]>;
    getProjectsById(user: User, projectId: string): Promise<import("clockify-ts/dist/cjs/Types/ProjectType").ProjectType>;
    createProject(user: User, dto: CreateProjectDto): Promise<import("clockify-ts/dist/cjs/Types/ProjectType").ProjectType>;
    updateProject(user: User, dto: UpdateProjectDto, projectId: string): Promise<import("clockify-ts/dist/cjs/Types/ProjectType").ProjectType>;
    deleteProject(user: User, projectId: string): Promise<void>;
    createProjectReport(user: User, projectId: string, dto: ReportParamsDto): Promise<import(".prisma/client").Project>;
    deleteProjectReport(projectId: string): Promise<void>;
    updateProjectReport(projectId: string, dto: UpdateReportDto, user: User): Promise<import(".prisma/client").Project>;
}
