import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class SalaryHistoryInput {
  @IsString()
  clockifyId: string;

  @IsNotEmpty()
  @IsDateString()
  start: string;

  @IsNotEmpty()
  @IsDateString()
  end: string;

  @IsNotEmpty()
  hourlyRate: number;
}
