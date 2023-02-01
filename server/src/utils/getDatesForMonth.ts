export function getDatesForMonth(month: string): { start: Date; end: Date } {
  const parts = month.split('.');
  const monthNum = parseInt(parts[0]) - 1;
  const year = parseInt(parts[1]);
  let end = new Date(year, monthNum + 1, 0);
  if (
    monthNum === 1 &&
    ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)
  ) {
    end = new Date(year, monthNum + 1, 1);
  }
  const start = new Date(year, monthNum, 1);
  return { start, end };
}
