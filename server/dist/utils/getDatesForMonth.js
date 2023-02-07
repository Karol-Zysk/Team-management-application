"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatesForMonth = void 0;
function getDatesForMonth(month) {
    const parts = month.split('.');
    const monthNum = parseInt(parts[0]) - 1;
    const year = parseInt(parts[1]);
    let end = new Date(year, monthNum + 1, 0);
    if (monthNum === 1 &&
        ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) {
        end = new Date(year, monthNum + 1, 1);
    }
    const start = new Date(year, monthNum, 1);
    return { start, end };
}
exports.getDatesForMonth = getDatesForMonth;
//# sourceMappingURL=getDatesForMonth.js.map