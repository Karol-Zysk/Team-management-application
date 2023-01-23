import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class SalaryParamsDto {
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  date: string;
  @IsOptional()
  start?: any;
  @IsOptional()
  end?: any;
  @IsOptional()
  @IsString()
  project?: string;
  @IsOptional()
  @IsBoolean()
  hydrated?: boolean;
  @IsOptional()
  @IsNumber()
  page?: number;
}
