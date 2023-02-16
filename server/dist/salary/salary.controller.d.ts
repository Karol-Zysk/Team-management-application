import { SalaryService } from './salary.service';
import { User } from '@prisma/client';
import { SalaryParamsDto } from './dto';
import { EmployeesSalaryReporDto } from '../employee/dto';
export declare class SalaryController {
    private salaryService;
    constructor(salaryService: SalaryService);
    geEmployeesSalary(user: User, dto: SalaryParamsDto): Promise<import(".prisma/client").Employee[]>;
    employeesSalaryReport(user: User, dto: EmployeesSalaryReporDto): Promise<import(".prisma/client").Report>;
    geEmployeeSalaryById(user: User, employeeId: string, dto: SalaryParamsDto): Promise<import(".prisma/client").Employee>;
    getAllEmployeeSalaryReports(user: User): Promise<import(".prisma/client").Report[]>;
}
