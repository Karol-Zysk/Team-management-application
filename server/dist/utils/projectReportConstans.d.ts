import { ReportParamsDto } from '../projects/dto';
export declare function projectReportConstans({ projectId, dto, salary, }: {
    projectId: string;
    dto: ReportParamsDto;
    salary: number;
}): Promise<{
    project: any;
    timeEstimate: number;
    parsedDuration: number;
    summary: number;
    budgetEstimate: any;
}>;
