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
  hoursWorked: number;
  @IsNumber()
  @IsOptional()
  project_hours: number;
  @IsNumber()
  @IsOptional()
  hourlyRate: number;
  @IsDate()
  @IsOptional()
  contractEnds: Date;
  @IsString()
  @IsOptional()
  profilePicture: string;
  @IsString()
  @IsOptional()
  clockifyId: string;
  @IsNumber()
  @IsOptional()
  salary?: number;
}
