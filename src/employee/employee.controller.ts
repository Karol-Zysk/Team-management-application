import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import axios from 'axios';
import { GetUser } from 'src/auth/decorators';
import { JwtGuard } from 'src/auth/guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmployeeService } from './employee.service';

@UseGuards(JwtGuard)
@Controller('employees')
export class EmployeeController {
  constructor(
    private prisma: PrismaService,
    private employeeService: EmployeeService,
  ) {}
  @Get()
  async syncClockifyEmployees(@GetUser() user: User) {
    return await this.employeeService.syncClockifyEmployees(user);
  }
  // @Post()
  // createEmployee(@Body() dto: any, @GetUser() user: User) {
  //   const id = user.id;
  //   const employee = this.prisma.employee.create({
  //     data: {
  //       employee_email: dto.email,
  //       employee_name: dto.name,
  //       user: { connect: { id } },
  //       clockifyId: dto.clockifyId,
  //     },
  //   });

  //   return employee;
  // }

  @Get('me')
  async getTimeEnteries(@GetUser() user: User) {
    return user;

    //   // const userId = `63beea4c6e59b4047b6e193d`;
    //   const userId = `63beea305e398c3868862564`;
    //   const userId3 = `63beea4c6e59b4047b6e193d`;
    //   const workspace = `63bdb6b7a938f743f92ac760`;
    //   const clockifyApiKey = 'OWY1ZTBjMWUtMGI3Ni00YmE1LTllMWYtZjA0YWQwOTYyODg0';
    //   const clockify = new Clockify(`${clockifyApiKey}`);
    //   const timeEntries = await clockify.workspace
    //     .withId(workspace)
    //     .users.get({});
    //   async function countWorkHoursPerUser(timeEntries) {
    //     const users = new Set();
    //     const workHours = {};
    //     timeEntries.forEach((entry) => {
    //       users.add(entry.userId);
    //     });
    //     let totalWorkHours = 0;
    //     // Iterate over unique user IDs
    //     for (const userId of users) {
    //       // Filter time entries for the current user
    //       const userEntries = timeEntries.filter(
    //         (entry) => entry.userId === userId,
    //       );
    //       userEntries.forEach((entry) => {
    //         if (entry.timeInterval.end) {
    //           const start = new Date(entry.timeInterval.start);
    //           const end = new Date(entry.timeInterval.end);
    //           const duration = (Number(end) - Number(start)) / 1000 / 60 / 60;
    //           totalWorkHours += duration;
    //         }
    //       });
    //       workHours[`${userId}`] = totalWorkHours;
    //     }
    //     return totalWorkHours;
    //   }
    //   return timeEntries;
  }

  @Post('report')
  async getReport(@Body() dto: any) {
    const apiKey = 'OWY1ZTBjMWUtMGI3Ni00YmE1LTllMWYtZjA0YWQwOTYyODg0';
    const url = `https://api.clockify.me/api/v1/workspaces/63bdb6b7a938f743f92ac760/reports/summary`;

    try {
      const response = await axios.post(url, dto, {
        headers: { 'X-Api-Key': apiKey },
      });
      return response.data;
    } catch (error) {
      console.log(error.response);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
