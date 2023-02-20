import { ReportParamsDto } from '../projects/dto';
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
    duration(project.duration).asHours().toFixed(2),
  );
  const parsedEstimate = Number(
    duration(project.timeEstimate.estimate).asHours().toFixed(1),
  );

  const timeEstimate = dto.timeEstimate || parsedEstimate || 0;

  return {
    project,
    timeEstimate,
    parsedDuration,
    summary,
    budgetEstimate,
  };
}
