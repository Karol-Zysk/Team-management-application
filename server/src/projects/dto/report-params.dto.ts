import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ReportParamsDto {
  @IsNotEmpty()
  @IsDateString()
  start: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  end: string;
  @IsString()
  @IsOptional()
  projectName: string;
  @IsString()
  @IsOptional()
  project: string;
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
