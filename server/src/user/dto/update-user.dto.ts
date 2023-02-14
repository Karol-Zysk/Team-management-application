import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  clockify_api_key: string;
  @IsOptional()
  @IsString()
  companyName: string;
}
