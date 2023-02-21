"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHoursWorked = void 0;
const moment = require("moment");
async function getHoursWorked({ clockifyId: clockifyId, dto: dto, date: date, workspaceId: workspaceId, projectId: projectId, }) {
    const project = projectId || dto.projectId;
    const timeEntries = await this.clockify.workspace
        .withId(workspaceId)
        .users.withId(clockifyId)
        .timeEntries.get(Object.assign(Object.assign({}, dto), { start: dto.start
            ? new Date(dto.start)
            : date
                ? new Date(date === null || date === void 0 ? void 0 : date.start)
                : new Date('2016-01-01'), end: dto.end
            ? new Date(dto.end)
            : date
                ? new Date(date === null || date === void 0 ? void 0 : date.end)
                : new Date(Date.now()), project, 'page-size': 5000 }));
    let totalWorkingTime = 0;
    timeEntries.forEach((timeEntry) => {
        const workingTime = moment.duration(timeEntry.timeInterval.duration);
        if (workingTime) {
            totalWorkingTime += workingTime.asMilliseconds();
        }
    });
    const hours = Number((totalWorkingTime / (1000 * 60 * 60)).toFixed(2));
    return hours;
}
exports.getHoursWorked = getHoursWorked;
//# sourceMappingURL=getHoursWorked.js.map