import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateReportDto {
  @IsOptional()
  @IsNumber()
  projectName: string;
  @IsOptional()
  @IsNumber()
  budgetEstimate: number;
  @IsOptional()
  @IsNumber()
  timeEstimate: number;

  @IsOptional()
  @IsNumber()
  duration: number;

  @IsOptional()
  @IsNumber()
  expenses: number;

  @IsOptional()
  @IsString()
  note: string;

  @IsOptional()
  @IsString()
  clientName: string;
  @IsOptional()
  @IsString()
  clientId: string;
}
