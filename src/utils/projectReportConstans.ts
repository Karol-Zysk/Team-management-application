import { ReportParamsDto } from 'src/projects/dto';
import { duration } from 'moment';

export async function projectReportConstans({
  projectId,
  dto,
  salary,
}: {
  projectId: string;
  dto: ReportParamsDto;
  salary: number;
}) {
  const workspaces = await this.clockify.workspaces.get();
  const project = await this.clockify.workspace
    .withId(workspaces[0].id)
    .projects.withId(projectId)
    .get();

  const budgetEstimate =
    dto.budgetEstimate || project.budgetEstimate?.estimate || 0;
  const summary = budgetEstimate - salary;

  const parsedDuration = Number(
    duration(project.duration).asHours().toFixed(1),
  );
  const parsedEstimate = Number(
    duration(project.timeEstimate.estimate).asHours().toFixed(1),
  );

  const timeEstimate = dto.timeEstimate || parsedEstimate || 0;

  const members = await Promise.all(
    project.memberships.map(async (member) => {
      const employee = await this.prisma.employee.findFirst({
        where: { clockifyId: member.userId },
        select: { clockifyName: true },
      });
      return employee.clockifyName;
    }),
  );

  return {
    project,
    members,
    timeEstimate,
    parsedDuration,
    summary,
    budgetEstimate,
  };
}
