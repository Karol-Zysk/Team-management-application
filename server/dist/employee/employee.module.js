"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeModule = void 0;
const common_1 = require("@nestjs/common");
const employee_service_1 = require("./employee.service");
const employee_controller_1 = require("./employee.controller");
const guard_1 = require("../auth/guard");
const crypto_service_1 = require("../cryptography/crypto.service");
const crypto_module_1 = require("../cryptography/crypto.module");
const clockify_service_1 = require("../clockify/clockify.service");
const clockify_module_1 = require("../clockify/clockify.module");
let EmployeeModule = class EmployeeModule {
};
EmployeeModule = __decorate([
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    (0, common_1.Module)({
        imports: [crypto_module_1.CryptoModule, clockify_module_1.ClockifyModule],
        providers: [employee_service_1.EmployeeService, crypto_service_1.CryptoService, clockify_service_1.ClockifyService],
        controllers: [employee_controller_1.EmployeeController],
    })
], EmployeeModule);
exports.EmployeeModule = EmployeeModule;
//# sourceMappingURL=employee.module.js.map