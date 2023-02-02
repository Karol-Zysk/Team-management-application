import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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
  @IsString()
  profilePicture: string;
  @IsNotEmpty()
  @IsString()
  clockifyId: string;
  @IsOptional()
  @IsNumber()
  salary: number;
}
