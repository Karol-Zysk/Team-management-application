"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsModule = void 0;
const common_1 = require("@nestjs/common");
const projects_service_1 = require("./projects.service");
const projects_controller_1 = require("./projects.controller");
const clockify_module_1 = require("../clockify/clockify.module");
const clockify_service_1 = require("../clockify/clockify.service");
const crypto_module_1 = require("../cryptography/crypto.module");
const crypto_service_1 = require("../cryptography/crypto.service");
let ProjectsModule = class ProjectsModule {
};
ProjectsModule = __decorate([
    (0, common_1.Module)({
        imports: [clockify_module_1.ClockifyModule, crypto_module_1.CryptoModule],
        providers: [projects_service_1.ProjectsService, crypto_service_1.CryptoService, clockify_service_1.ClockifyService],
        controllers: [projects_controller_1.ProjectsController],
    })
], ProjectsModule);
exports.ProjectsModule = ProjectsModule;
//# sourceMappingURL=projects.module.js.map