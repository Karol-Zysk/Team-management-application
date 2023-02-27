import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  clockify_api_key: string;
  @IsNotEmpty()
  @IsString()
  companyName: string;
}
