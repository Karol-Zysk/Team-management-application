import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  clockify_api_key: string;
}
