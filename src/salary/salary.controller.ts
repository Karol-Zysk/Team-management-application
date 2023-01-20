import { Controller } from '@nestjs/common';
import { SalaryService } from './salary.service';
import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorators';
import { User } from '@prisma/client';
import {
  Param,
  Body,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { SalaryParamsDto } from './dto';

@UseGuards(JwtGuard)
@Controller('salary')
export class SalaryController {
  constructor(private salaryService: SalaryService) {}

  @Get(':id')
  geEmployeeSalary(
    @GetUser() user: User,
    @Param('id') employeeId: string,
    @Body() dto: SalaryParamsDto,
  ) {
    return this.salaryService.geEmployeeSalary(user, employeeId, dto);
  }
}
