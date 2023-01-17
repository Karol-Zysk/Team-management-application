import {
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateEmployeeDto {
  @IsString()
  @IsOptional()
  name: string;
  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;
  @IsNumber()
  @IsOptional()
  total_hours_worked: number;
  @IsNumber()
  @IsOptional()
  project_hours: number;
  @IsNumber()
  @IsOptional()
  hourly_rate: number;
  @IsDate()
  @IsOptional()
  contract_ends: Date;
  @IsString()
  @IsOptional()
  profilePicture: string;
  @IsString()
  @IsOptional()
  clockifyId: string;
}
