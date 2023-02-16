import { User } from '@prisma/client';
import { ClockifyService } from '../clockify/clockify.service';
import { SalaryParamsDto } from './dto';
import { EmployeesSalaryReporDto } from '../employee/dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class SalaryService {
    private clockify;
    private prisma;
    constructor(clockify: ClockifyService, prisma: PrismaService);
    geEmployeesSalary(user: User, dto: SalaryParamsDto): Promise<{
        employeesWithSalary: import(".prisma/client").Employee[];
        workspaceId: string;
    }>;
    employeesSalaryReport(user: User, dto: EmployeesSalaryReporDto): Promise<import(".prisma/client").Report>;
    createEmployeeSalaryById(user: User, dto: SalaryParamsDto, employeeId: string): Promise<import(".prisma/client").Employee>;
    getAllEmployeeSalaryReports(user: User): Promise<import(".prisma/client").Report[]>;
    deleteEmployeeSalaryReport(salaryId: string): Promise<void>;
}
