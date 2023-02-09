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
exports.EmployeeService = void 0;
const common_1 = require("@nestjs/common");
const clockify_service_1 = require("../clockify/clockify.service");
const prisma_service_1 = require("../prisma/prisma.service");
let EmployeeService = class EmployeeService {
    constructor(prisma, clockify) {
        this.prisma = prisma;
        this.clockify = clockify;
    }
    async syncClockifyEmployees(user) {
        const { employees, workspaceId } = await this.clockify.getEmployees(user);
        for (const employee of employees) {
            try {
                const existingEmployees = await this.prisma.employee.findMany({
                    where: { clockifyId: employee.id, userId: user.id },
                });
                if (!existingEmployees.length) {
                    await this.prisma.employee.create({
                        data: {
                            clockifyId: employee.id,
                            email: employee.email,
                            clockifyName: employee.name,
                            profilePicture: employee.profilePicture,
                            userId: user.id,
                            workspaceId,
                        },
                    });
                }
                else {
                    continue;
                }
                await this.prisma.user.update({
                    where: { id: user.id },
                    data: { sync: true },
                });
                return;
            }
            catch (error) {
                throw error;
            }
        }
        return await this.prisma.employee.findMany({
            where: {
                userId: user.id,
                workspaceId,
            },
        });
    }
    async createEmployee(dto, user) {
        const hourlyRate = dto.hourlyRate || 0;
        const hoursWorked = 0;
        try {
            const { employees, workspaceId } = await this.clockify.getEmployees(user);
            const employeeId = employees.find((e) => e.id === dto.clockifyId);
            if (!employeeId)
                throw new common_1.NotFoundException(`There is no employee with clockifyId: ${dto.clockifyId} in your workspace`);
            const existingClockifyId = await this.prisma.employee.findMany({
                where: {
                    userId: user.id,
                },
                select: {
                    clockifyId: true,
                },
            });
            const existingId = existingClockifyId.find((e) => e.clockifyId === dto.clockifyId);
            if (existingId)
                throw new common_1.ConflictException('User with this clockifyId or email already exist');
            const existingEmployee = await this.prisma.employee.findFirst({
                where: {
                    userId: user.id,
                    email: dto.email,
                },
            });
            if (existingEmployee)
                throw new common_1.ConflictException('User elo with this clockifyId or email already exist');
            const employee = await this.prisma.employee.create({
                data: Object.assign(Object.assign({}, dto), { salary: hourlyRate * hoursWorked, user: { connect: { id: user.id } }, workspaceId }),
            });
            return employee;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updateEmployee(dto, user, employeeId) {
        try {
            const { employees, workspaceId } = await this.clockify.getEmployees(user);
            const existingEmployee = await this.prisma.employee.findUnique({
                where: { id: employeeId },
            });
            if (!existingEmployee)
                throw new common_1.NotFoundException('Invalid User Id');
            const duplicateEmail = employees.find((e) => e.email === dto.email);
            if (duplicateEmail)
                throw new common_1.NotFoundException(`This email is already taken by user in your workspace`);
            const { hourlyRate, hoursWorked } = await this.prisma.employee.findUnique({
                where: { id: employeeId },
                select: { hourlyRate: true, hoursWorked: true },
            });
            const salary = (dto.hourlyRate || hourlyRate) * hoursWorked;
            await this.prisma.employee.updateMany({
                where: { id: employeeId, workspaceId, userId: user.id },
                data: Object.assign(Object.assign({}, dto), { salary }),
            });
            return 'Updated';
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getAllEmployess(user) {
        const { workspaceId } = await this.clockify.getEmployees(user);
        const employees = await this.prisma.employee.findMany({
            where: {
                userId: user.id,
                workspaceId,
            },
        });
        return employees;
    }
    async getEmployeeById(user, employeeId) {
        try {
            const employee = await this.prisma.employee.findUnique({
                where: {
                    id: employeeId,
                },
            });
            if (employee.userId !== user.id)
                throw new common_1.BadRequestException('Invalid User Id');
            return employee;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async deleteEmployeeById(user, employeeId) {
        try {
            const employee = await this.prisma.employee.deleteMany({
                where: {
                    id: employeeId,
                    userId: user.id,
                },
            });
            if (employee.count === 0) {
                throw new common_1.BadRequestException('Invalid User Id');
            }
            return;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async addSalaryHistory(employeeId, dto) {
        try {
            const employee = await this.prisma.employee.findUnique({
                where: { id: employeeId },
            });
            if (!employee) {
                throw new Error('Employee not found');
            }
            const newSalaryHistory = await this.prisma.salaryHistory.create({
                data: {
                    start: new Date(dto.start),
                    end: new Date(dto.end),
                    hourlyRate: dto.hourlyRate,
                    Employee: {
                        connect: { id: employee.id },
                    },
                },
            });
            return newSalaryHistory;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
};
EmployeeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        clockify_service_1.ClockifyService])
], EmployeeService);
exports.EmployeeService = EmployeeService;
//# sourceMappingURL=employee.service.js.map