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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeController = void 0;
const common_1 = require("@nestjs/common");
const decorators_1 = require("../auth/decorators");
const guard_1 = require("../auth/guard");
const prisma_service_1 = require("../prisma/prisma.service");
const employee_service_1 = require("./employee.service");
const dto_1 = require("./dto");
const decorators_2 = require("@nestjs/common/decorators");
const enums_1 = require("@nestjs/common/enums");
let EmployeeController = class EmployeeController {
    constructor(prisma, employeeService) {
        this.prisma = prisma;
        this.employeeService = employeeService;
    }
    async syncClockifyEmployees(user) {
        return await this.employeeService.syncClockifyEmployees(user);
    }
    async clean() {
        return await this.prisma.cleanDB();
    }
    createEmployee(dto, user) {
        return this.employeeService.createEmployee(dto, user);
    }
    updateEmployee(dto, user, employeeId) {
        return this.employeeService.updateEmployee(dto, user, employeeId);
    }
    getAllEmployess(user) {
        return this.employeeService.getAllEmployess(user);
    }
    getEmployeeById(user, id) {
        return this.employeeService.getEmployeeById(user, id);
    }
    deleteEmployeeById(user, id) {
        return this.employeeService.deleteEmployeeById(user, id);
    }
    addSalaryHistory(id, dto) {
        return this.employeeService.addSalaryHistory(id, dto);
    }
};
__decorate([
    (0, common_1.Post)('syncclockify'),
    __param(0, (0, decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "syncClockifyEmployees", null);
__decorate([
    (0, common_1.Get)('clean'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "clean", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateEmployeeDto, Object]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "createEmployee", null);
__decorate([
    (0, decorators_2.Patch)(':id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.GetUser)()),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.UpdateEmployeeDto, Object, String]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "updateEmployee", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "getAllEmployess", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "getEmployeeById", null);
__decorate([
    (0, common_1.HttpCode)(enums_1.HttpStatus.NO_CONTENT),
    (0, decorators_2.Delete)(':id'),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "deleteEmployeeById", null);
__decorate([
    (0, common_1.Post)('salaryhistory/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.SalaryHistoryInput]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "addSalaryHistory", null);
EmployeeController = __decorate([
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    (0, common_1.Controller)('employees'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        employee_service_1.EmployeeService])
], EmployeeController);
exports.EmployeeController = EmployeeController;
//# sourceMappingURL=employee.controller.js.map