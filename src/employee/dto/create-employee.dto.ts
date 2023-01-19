import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @IsOptional()
  @IsString()
  firstName: string;
  @IsOptional()
  @IsString()
  lastName: string;
  @IsOptional()
  @IsString()
  clockifyName: string;
  @IsEmail()
  @IsString()
  email: string;
  @IsOptional()
  @IsNumber()
  hourlyRate: number;
  @IsOptional()
  @IsNumber()
  hoursWorked: number;
  @IsOptional()
  @IsString()
  profilePicture: string;
  @IsOptional()
  @IsNumber()
  clockifyId: string;
}
