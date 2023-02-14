import { IsOptional, IsString } from 'class-validator';

export class EmployeesSalaryReporDto {
  @IsOptional()
  @IsString()
  date: string;
  @IsOptional()
  @IsString()
  start: string;
  @IsOptional()
  @IsString()
  end: string;
}
