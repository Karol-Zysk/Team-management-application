import { SalaryService } from './salary.service';
import { User } from '@prisma/client';
import { SalaryParamsDto } from './dto';
import { EmployeesSalaryReporDto } from '../employee/dto';
export declare class SalaryController {
    private salaryService;
    constructor(salaryService: SalaryService);
    geEmployeesSalary(user: User, dto: SalaryParamsDto): Promise<{
        employeesWithSalary: import(".prisma/client").Employee[];
        workspaceId: string;
    }>;
    employeesSalaryReport(user: User, dto: EmployeesSalaryReporDto): Promise<import(".prisma/client").Report>;
    deleteEmployeeSalaryReport(salaryId: string): Promise<void>;
    geEmployeeSalaryById(user: User, employeeId: string, dto: SalaryParamsDto): Promise<import(".prisma/client").Employee>;
    getAllEmployeeSalaryReports(user: User): Promise<import(".prisma/client").Report[]>;
}
