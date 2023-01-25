export async function getHoursWorked({
  clockifyId: clockifyId,
  dto: dto,
  date: date,
  projectId: projectId,
}) {
  const workspaces = await this.clockify.workspaces.get();
  const project = projectId || dto.projectId;
  const timeEntries = await this.clockify.workspace
    .withId(workspaces[0].id)
    .users.withId(clockifyId)
    .timeEntries.get({
      ...dto,
      start: dto.start
        ? new Date(dto.start)
        : date
        ? new Date(date?.start)
        : new Date('2015'),
      end: dto.end
        ? new Date(dto.end)
        : date
        ? new Date(date?.end)
        : new Date(Date.now()),
      project,
    });

  let totalWorkingTime = 0;
  timeEntries.forEach((timeEntry) => {
    const start = new Date(timeEntry.timeInterval.start).getTime();
    const end = new Date(timeEntry.timeInterval.end).getTime();
    const workingTime = end - start;
    totalWorkingTime += workingTime;
  });
  const hours = Number((totalWorkingTime / (1000 * 60 * 60)).toFixed(1));

  return hours;
}
