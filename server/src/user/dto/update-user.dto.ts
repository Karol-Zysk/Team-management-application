import {
  IsAlphanumeric,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(6)
  @MaxLength(16)
  @IsAlphanumeric()
  name?: string;
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  clockify_api_key: string;
}
