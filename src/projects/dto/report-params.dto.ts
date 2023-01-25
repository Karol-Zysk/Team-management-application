import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class ReportParamsDto {
  @IsOptional()
  @IsNumber()
  budgetEstimate: number;
  @IsOptional()
  @IsNumber()
  timeEstimate: number;
  projectName: string;
  @IsOptional()
  @IsNumber()
  duration: number;
  projectId: string;
  @IsOptional()
  @IsNumber()
  expenses: number;
  @IsOptional()
  @IsNumber()
  summary: number;
  @IsOptional()
  @IsString()
  note: string;
  @IsOptional()
  @IsString()
  memberships: string[];
  @IsOptional()
  @IsBoolean()
  active: boolean;
  @IsOptional()
  @IsString()
  clientName: string;
  @IsOptional()
  @IsString()
  clientId: string;
  @IsOptional()
  @IsString()
  userId: string;
}
