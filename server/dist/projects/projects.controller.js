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
exports.ProjectsController = void 0;
const common_1 = require("@nestjs/common");
const projects_service_1 = require("./projects.service");
const guard_1 = require("../auth/guard");
const decorators_1 = require("../auth/decorators");
const decorators_2 = require("@nestjs/common/decorators");
const dto_1 = require("./dto");
const enums_1 = require("@nestjs/common/enums");
let ProjectsController = class ProjectsController {
    constructor(projectsservice) {
        this.projectsservice = projectsservice;
    }
    async getProjects(user) {
        return this.projectsservice.getProjects(user);
    }
    async getProjectsById(user, projectId) {
        return this.projectsservice.getProjectsById(user, projectId);
    }
    async createProject(user, payload) {
        return this.projectsservice.createProject(user, payload);
    }
    async updateProject(user, payload, projectId) {
        return this.projectsservice.updateProject(user, payload, projectId);
    }
    async deleteProject(user, projectId) {
        return this.projectsservice.deleteProject(user, projectId);
    }
    async projectReport(user, projectId, dto) {
        return this.projectsservice.createProjectReport(user, projectId, dto);
    }
    async deleteProjectReport(projectId) {
        return this.projectsservice.deleteProjectReport(projectId);
    }
    async updateProjectReport(projectId, dto, user) {
        return this.projectsservice.updateProjectReport(projectId, dto, user);
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "getProjects", null);
__decorate([
    (0, common_1.Get)(':projectId'),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, decorators_2.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "getProjectsById", null);
__decorate([
    (0, decorators_2.Post)(''),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, decorators_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateProjectDto]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "createProject", null);
__decorate([
    (0, decorators_2.Patch)(':id'),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, decorators_2.Body)()),
    __param(2, (0, decorators_2.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.UpdateProjectDto, String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "updateProject", null);
__decorate([
    (0, decorators_2.HttpCode)(enums_1.HttpStatus.NO_CONTENT),
    (0, decorators_2.Delete)(':id'),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, decorators_2.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "deleteProject", null);
__decorate([
    (0, decorators_2.Post)('report/:id'),
    __param(0, (0, decorators_1.GetUser)()),
    __param(1, (0, decorators_2.Param)('id')),
    __param(2, (0, decorators_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.ReportParamsDto]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "projectReport", null);
__decorate([
    (0, decorators_2.Delete)('report/:id'),
    __param(0, (0, decorators_2.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "deleteProjectReport", null);
__decorate([
    (0, decorators_2.Patch)('report/:id'),
    __param(0, (0, decorators_2.Param)('id')),
    __param(1, (0, decorators_2.Body)()),
    __param(2, (0, decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateReportDto, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "updateProjectReport", null);
ProjectsController = __decorate([
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    (0, common_1.Controller)('projects'),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService])
], ProjectsController);
exports.ProjectsController = ProjectsController;
//# sourceMappingURL=projects.controller.js.map