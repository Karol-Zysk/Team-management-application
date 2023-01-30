import * as moment from 'moment';

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
        : new Date('2020'),
      end: dto.end
        ? new Date(dto.end)
        : date
        ? new Date(date?.end)
        : new Date(Date.now()),
      project,
    });

  let totalWorkingTime = 0;

  timeEntries.forEach((timeEntry) => {
    const start = moment(timeEntry.timeInterval.start);
    const end = moment(timeEntry.timeInterval.end);

    if (start.isValid() && end.isValid()) {
      const workingTime = moment.duration(end.diff(start));
      totalWorkingTime += workingTime.asMilliseconds();
    }
  });
  const hours = Number((totalWorkingTime / (1000 * 60 * 60)).toFixed(1));

  return hours;
}
