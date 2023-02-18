import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  clockify_api_key: string;
  @IsOptional()
  @IsString()
  companyName: string;
}
