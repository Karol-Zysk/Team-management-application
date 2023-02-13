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
exports.SalaryService = void 0;
const common_1 = require("@nestjs/common");
const clockify_service_1 = require("../clockify/clockify.service");
const exceptions_1 = require("@nestjs/common/exceptions");
let SalaryService = class SalaryService {
    constructor(clockify) {
        this.clockify = clockify;
    }
    async geEmployeesSalary(user, dto) {
        const salary = await this.clockify.geEmployeesSalary(user, dto);
        return salary;
    }
    employeesSalaryReport(user, dto) {
        return this.clockify.employeesSalaryReport(user, dto);
    }
    async createEmployeeSalaryById(user, dto, employeeId) {
        try {
            const salary = await this.clockify.geEmployeeSalaryById(user, dto, employeeId);
            return salary;
        }
        catch (error) {
            throw new exceptions_1.BadRequestException(error.message);
        }
    }
};
SalaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [clockify_service_1.ClockifyService])
], SalaryService);
exports.SalaryService = SalaryService;
//# sourceMappingURL=salary.service.js.map