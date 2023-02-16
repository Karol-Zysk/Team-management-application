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
exports.ClockifyService = void 0;
const common_1 = require("@nestjs/common");
const clockify_ts_1 = require("clockify-ts");
const crypto_service_1 = require("../cryptography/crypto.service");
const prisma_service_1 = require("../prisma/prisma.service");
const utils_1 = require("../utils");
let ClockifyService = class ClockifyService {
    constructor(cryptoService, prisma) {
        this.cryptoService = cryptoService;
        this.prisma = prisma;
    }
    async initClockify(user) {
        if (!user.hash_api_key)
            throw new common_1.ForbiddenException('Set up clockify apiKey first');
        const apiKey = this.cryptoService.decrypt(user.hash_api_key);
        this.clockify = new clockify_ts_1.default(apiKey);
        const workspaces = await this.clockify.workspaces.get();
        const workspaceId = workspaces[0].id;
        return { workspaceId };
    }
    async getEmployees(user) {
        try {
            const { workspaceId } = await this.initClockify(user);
            const employees = await this.clockify.workspaces
                .withId(workspaceId)
                .users.get({});
            return { employees, workspaceId };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid Api key');
        }
    }
    async getAllProjects(user) {
        const { workspaceId } = await this.initClockify(user);
        const projects = await this.clockify.workspace
            .withId(workspaceId)
            .projects.get();
        return projects;
    }
    async getProjectById(user, projectId) {
        const { workspaceId } = await this.initClockify(user);
        const project = await this.clockify.workspace
            .withId(workspaceId)
            .projects.withId(projectId)
            .get();
        return project;
    }
    async createProject(user, dto) {
        const { workspaceId } = await this.initClockify(user);
        const project = await this.clockify.workspace
            .withId(workspaceId)
            .projects.post({
            name: dto.name,
            note: dto.note,
        });
        return project;
    }
    async updateProject(user, dto, projectId) {
        const { workspaceId } = await this.initClockify(user);
        const updatedProject = await this.clockify.workspace
            .withId(workspaceId)
            .projects.withId(projectId)
            .put(Object.assign({}, dto));
        return updatedProject;
    }
    async deleteProject(user, projectId) {
        const { workspaceId } = await this.initClockify(user);
        await this.clockify.workspace
            .withId(workspaceId)
            .projects.withId(projectId)
            .delete();
        return;
    }
    async calculateSalary(clockifyId, user, dto, date) {
        await this.initClockify(user);
        const options = { clockifyId, dto, date };
        const hours = await utils_1.getHoursWorked.bind(this)(options);
        let hourlyRate;
        const employee = await this.prisma.employee.findFirst({
            where: { clockifyId: clockifyId, userId: user.id },
            select: {
                salaryHistory: true,
                hourlyRate: true,
            },
        });
        if (date) {
            const salaryHistory = employee.salaryHistory.find((salary) => date.start >= salary.start && date.start < salary.end);
            hourlyRate = salaryHistory
                ? salaryHistory.hourlyRate
                : employee.hourlyRate;
        }
        else {
            hourlyRate = employee.hourlyRate;
        }
        const salary = hours * hourlyRate;
        await this.prisma.employee.updateMany({
            where: { clockifyId: clockifyId, userId: user.id },
            data: { hoursWorked: hours, hourlyRate, salary },
        });
        return await this.prisma.employee.findFirst({
            where: { clockifyId: clockifyId, userId: user.id },
        });
    }
    async geEmployeesSalary(user, dto) {
        try {
            const { workspaceId } = await this.initClockify(user);
            const employees = await this.prisma.employee.findMany({
                where: { userId: user.id, workspaceId },
                select: { id: true, clockifyId: true, email: true },
            });
            const clockifyIds = employees.map((employee) => employee.clockifyId);
            let date;
            if (dto.date) {
                date = (0, utils_1.getDatesForMonth)(dto.date);
            }
            if (dto.start && dto.end) {
                date = {
                    start: new Date(Date.parse(dto.start)) ||
                        new Date(Date.parse('01.01.2015')),
                    end: new Date(Date.parse(dto.end)) || new Date(Date.now()),
                };
            }
            else {
                date = {
                    start: new Date(Date.parse('01.01.2015')),
                    end: new Date(Date.now()),
                };
            }
            const promises = [];
            for (const clockifyId of clockifyIds) {
                promises.push(this.calculateSalary(clockifyId, user, dto, date));
            }
            await Promise.all(promises);
            return this.prisma.employee.findMany({
                where: { userId: user.id, workspaceId },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async geEmployeeSalaryById(user, dto, employeeId) {
        try {
            let date;
            if (dto.date)
                date = (0, utils_1.getDatesForMonth)(dto.date);
            return this.calculateSalary(employeeId, user, dto, date);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async projectReport(user, projectId, dto) {
        try {
            const { workspaceId } = await this.initClockify(user);
            let date;
            if (!dto.end) {
                date = {
                    start: new Date(Date.parse(dto.start)),
                    end: new Date(Date.now()),
                };
            }
            else {
                date = {
                    start: new Date(Date.parse(dto.start)),
                    end: new Date(Date.parse(dto.end)),
                };
            }
            const employees = await this.prisma.employee.findMany({
                where: { userId: user.id, workspaceId },
                select: { id: true, clockifyId: true },
            });
            const clockifyIds = employees.map((employee) => employee.clockifyId);
            for (const clockifyId of clockifyIds) {
                const options = { clockifyId, dto, projectId };
                const hours = await utils_1.getHoursWorked.bind(this)(options);
                let hourlyRate;
                const employee = await this.prisma.employee.findFirst({
                    where: { clockifyId: clockifyId, userId: user.id, workspaceId },
                    select: {
                        salaryHistory: true,
                        hourlyRate: true,
                    },
                });
                if (date) {
                    const salaryHistory = employee.salaryHistory.find((salary) => date.start >= salary.start && date.start < salary.end);
                    hourlyRate = salaryHistory
                        ? salaryHistory.hourlyRate
                        : employee.hourlyRate;
                }
                else {
                    hourlyRate = employee.hourlyRate;
                }
                const salary = hours * hourlyRate;
                await this.prisma.employee.updateMany({
                    where: { clockifyId: clockifyId, userId: user.id, workspaceId },
                    data: { hoursWorked: hours, salary: Number(salary.toFixed(1)) },
                });
            }
            const totalSalary = await this.prisma.employee.aggregate({
                where: { userId: user.id, workspaceId },
                _sum: { salary: true },
            });
            const { _sum: { salary }, } = totalSalary;
            const reportParams = await utils_1.projectReportConstans.bind(this)({
                projectId,
                dto,
                salary,
                workspaceId,
            });
            return Object.assign(Object.assign({}, reportParams), { salary, date, workspaceId });
        }
        catch (error) {
            throw new common_1.UnauthorizedException(error.message);
        }
    }
    async employeesSalaryReport(user, dto) {
        const salary = await this.geEmployeesSalary(user, dto);
        const employeesSalary = salary.map((data) => {
            const { firstName, lastName, email, clockifyName, hourlyRate, hoursWorked, salary, } = data;
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
            const { workspaceId } = await this.initClockify(user);
            const report = await this.prisma.report.create({
                data: {
                    reportName: `${user.companyName}. Period:  ${dto.start} to:  ${dto.end}`,
                    workspaceId,
                    userId: user.id,
                    employees: employeesSalary,
                },
            });
            return report;
        }
        catch (error) {
            throw new common_1.UnauthorizedException(error.message);
        }
    }
    async getAllProjectReports(user) {
        console.log('elo');
        try {
            const { workspaceId } = await this.initClockify(user);
            const projectReports = await this.prisma.project.findMany({
                where: { userId: user.id, workspaceId },
            });
            return projectReports;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getAllEmployeeSalaryReports(user) {
        try {
            const { workspaceId } = await this.initClockify(user);
            const salaryReports = await this.prisma.report.findMany({
                where: { userId: user.id, workspaceId },
            });
            return salaryReports;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
};
ClockifyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [crypto_service_1.CryptoService,
        prisma_service_1.PrismaService])
], ClockifyService);
exports.ClockifyService = ClockifyService;
//# sourceMappingURL=clockify.service.js.map