import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  name: string;
  @IsString()
  @IsOptional()
  clientId: string;
  @IsBoolean()
  @IsOptional()
  isPublic: boolean;
  @IsOptional()
  hourlyRate: {
    amount: number;
  };
  @IsString()
  @IsOptional()
  color: string;
  @IsString()
  @IsOptional()
  note: string;
  @IsBoolean()
  @IsOptional()
  billable: boolean;
  @IsBoolean()
  @IsOptional()
  archived: boolean;
}
