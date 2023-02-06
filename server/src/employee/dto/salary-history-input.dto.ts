import { IsDateString, IsNotEmpty } from 'class-validator';

export class SalaryHistoryInput {
  @IsNotEmpty()
  @IsDateString()
  start: string;

  @IsNotEmpty()
  @IsDateString()
  end: string;

  @IsNotEmpty()
  hourlyRate: number;
}
