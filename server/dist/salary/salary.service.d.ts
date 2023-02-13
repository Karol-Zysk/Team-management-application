import { User } from '@prisma/client';
import { ClockifyService } from '../clockify/clockify.service';
import { SalaryParamsDto } from './dto';
import { EmployeesSalaryReporDto } from '../employee/dto';
export declare class SalaryService {
    private clockify;
    constructor(clockify: ClockifyService);
    geEmployeesSalary(user: User, dto: SalaryParamsDto): Promise<import(".prisma/client").Employee[]>;
    employeesSalaryReport(user: User, dto: EmployeesSalaryReporDto): Promise<import(".prisma/client").Report>;
    createEmployeeSalaryById(user: User, dto: SalaryParamsDto, employeeId: string): Promise<import(".prisma/client").Employee>;
}
