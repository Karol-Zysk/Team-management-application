"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectReportConstans = void 0;
const moment_1 = require("moment");
async function projectReportConstans({ projectId, dto, salary, }) {
    var _a;
    const workspaces = await this.clockify.workspaces.get();
    const project = await this.clockify.workspace
        .withId(workspaces[0].id)
        .projects.withId(projectId)
        .get();
    const budgetEstimate = dto.budgetEstimate || ((_a = project.budgetEstimate) === null || _a === void 0 ? void 0 : _a.estimate) || 0;
    const summary = budgetEstimate - salary;
    const parsedDuration = Number((0, moment_1.duration)(project.duration).asHours().toFixed(1));
    const parsedEstimate = Number((0, moment_1.duration)(project.timeEstimate.estimate).asHours().toFixed(1));
    const timeEstimate = dto.timeEstimate || parsedEstimate || 0;
    return {
        project,
        timeEstimate,
        parsedDuration,
        summary,
        budgetEstimate,
    };
}
exports.projectReportConstans = projectReportConstans;
//# sourceMappingURL=projectReportConstans.js.map