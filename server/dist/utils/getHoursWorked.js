"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHoursWorked = void 0;
const moment = require("moment");
const cache_manager_1 = require("cache-manager");
const memoryCache = cache_manager_1.default.caching({
    store: 'memory',
    max: 100,
    ttl: 60 * 60,
});
async function getHoursWorked({ clockifyId: clockifyId, dto: dto, date: date, }) {
    const cacheKey = `${clockifyId}_${JSON.stringify(dto)}_${JSON.stringify(date)}`;
    const cachedResult = await memoryCache.get(cacheKey);
    if (cachedResult) {
        console.log(`Using cached result for ${cacheKey}`);
        return cachedResult;
    }
    const workspaces = await this.clockify.workspaces.get();
    const timeEntries = await this.clockify.workspace
        .withId(workspaces[0].id)
        .users.withId(clockifyId)
        .timeEntries.get(Object.assign(Object.assign({}, dto), { start: dto.start
            ? new Date(dto.start)
            : date
                ? new Date(date === null || date === void 0 ? void 0 : date.start)
                : new Date('2020'), end: dto.end
            ? new Date(dto.end)
            : date
                ? new Date(date === null || date === void 0 ? void 0 : date.end)
                : new Date(Date.now()) }));
    let totalWorkingTime = 0;
    timeEntries.forEach((timeEntry) => {
        const workingTime = moment.duration(timeEntry.timeInterval.duration);
        if (workingTime) {
            totalWorkingTime += workingTime.asMilliseconds();
        }
    });
    const hours = Number((totalWorkingTime / (1000 * 60 * 60)).toFixed(2));
    await memoryCache.set(cacheKey, hours);
    return hours;
}
exports.getHoursWorked = getHoursWorked;
//# sourceMappingURL=getHoursWorked.js.map