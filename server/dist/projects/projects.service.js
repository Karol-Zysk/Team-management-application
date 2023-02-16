"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const clockify_service_1 = require("../clockify/clockify.service");
const exceptions_1 = require("@nestjs/common/exceptions");
const prisma_service_1 = require("../prisma/prisma.service");
let ProjectsService = class ProjectsService {
    constructor(clockify, prisma) {
        this.clockify = clockify;
        this.prisma = prisma;
    }
    async getProjects(user) {
        try {
            const projects = await this.clockify.getAllProjects(user);
            return projects;
        }
        catch (error) {
            throw new exceptions_1.UnauthorizedException(error.message);
        }
    }
    async getProjectsById(user, projectId) {
        try {
            const project = await this.clockify.getProjectById(user, projectId);
            return project;
        }
        catch (error) {
            throw new exceptions_1.UnauthorizedException(error.message);
        }
    }
    async createProject(user, dto) {
        try {
            const project = await this.clockify.createProject(user, dto);
            return project;
        }
        catch (error) {
            throw new exceptions_1.UnauthorizedException(error.message);
        }
    }
    async updateProject(user, dto, projectId) {
        try {
            const project = await this.clockify.updateProject(user, dto, projectId);
            return project;
        }
        catch (error) {
            throw new exceptions_1.UnauthorizedException(error.message);
        }
    }
    async deleteProject(user, projectId) {
        try {
            await this.clockify.deleteProject(user, projectId);
            return;
        }
        catch (error) {
            throw new exceptions_1.UnauthorizedException(error.message);
        }
    }
    async createProjectReport(user, projectId, dto) {
        try {
            const { project, timeEstimate, parsedDuration, summary, budgetEstimate, salary, date, workspaceId, } = await this.clockify.projectReport(user, projectId, dto);
            const projectMembers = await this.prisma.employee.findMany({
                where: {
                    AND: [{ userId: user.id, workspaceId }],
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
        }
        catch (error) {
            throw new exceptions_1.ConflictException(error.message);
        }
    }
    async deleteProjectReport(projectId) {
        try {
            const report = await this.prisma.project.findFirst({
                where: { id: projectId },
            });
            if (!report)
                throw new exceptions_1.NotFoundException('Invalid Id');
            await this.prisma.project.delete({
                where: { id: projectId },
            });
            return;
        }
        catch (error) {
            throw new exceptions_1.UnauthorizedException(error.message);
        }
    }
    async getAllProjectReports(user) {
        return this.clockify.getAllProjectReports(user);
    }
    async updateProjectReport(projectId, dto, user) {
        try {
            const totalSalary = await this.prisma.employee.aggregate({
                where: { userId: user.id },
                _sum: { salary: true },
            });
            const { _sum: { salary }, } = totalSalary;
            const project = await this.prisma.project.findFirst({
                where: { projectId },
            });
            if (!project)
                throw new exceptions_1.NotFoundException('Invalid Id');
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
        }
        catch (error) {
            throw new exceptions_1.UnauthorizedException(error.message);
        }
    }
};
ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [clockify_service_1.ClockifyService,
        prisma_service_1.PrismaService])
], ProjectsService);
exports.ProjectsService = ProjectsService;
//# sourceMappingURL=projects.service.js.map