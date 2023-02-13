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
exports.SalaryController = void 0;
const common_1 = require("@nestjs/common");
const salary_service_1 = require("./salary.service");
const request_mapping_decorator_1 = require("@nestjs/common/decorators/http/request-mapping.decorator");
const use_guards_decorator_1 = require("@nestjs/common/decorators/core/use-guards.decorator");
const guard_1 = require("../auth/guard");
const decorators_1 = require("../auth/decorators");
const route_params_decorator_1 = require("@nestjs/common/decorators/http/route-params.decorator");
const dto_1 = require("./dto");
const dto_2 = require("../employee/dto");
let SalaryController = class SalaryController {
    constructor(salaryService) {
        this.salaryService = salaryService;
    }
    geEmployeesSalary(user, dto) {
        return this.salaryService.geEmployeesSalary(user, dto);
    }
    employeesSalaryReport(user, dto) {
        return this.salaryService.employeesSalaryReport(user, dto);
    }
    geEmployeeSalaryById(user, employeeId, dto) {
        return this.salaryService.createEmployeeSalaryById(user, dto, employeeId);
    }
};
__decorate([
    (0, request_mapping_decorator_1.Get)(''),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, route_params_decorator_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.SalaryParamsDto]),
    __metadata("design:returntype", void 0)
], SalaryController.prototype, "geEmployeesSalary", null);
__decorate([
    (0, request_mapping_decorator_1.Post)('/report'),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, route_params_decorator_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_2.EmployeesSalaryReporDto]),
    __metadata("design:returntype", void 0)
], SalaryController.prototype, "employeesSalaryReport", null);
__decorate([
    (0, request_mapping_decorator_1.Post)(':id'),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, route_params_decorator_1.Param)('id')),
    __param(2, (0, route_params_decorator_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.SalaryParamsDto]),
    __metadata("design:returntype", void 0)
], SalaryController.prototype, "geEmployeeSalaryById", null);
SalaryController = __decorate([
    (0, use_guards_decorator_1.UseGuards)(guard_1.JwtGuard),
    (0, common_1.Controller)('salary'),
    __metadata("design:paramtypes", [salary_service_1.SalaryService])
], SalaryController);
exports.SalaryController = SalaryController;
//# sourceMappingURL=salary.controller.js.map