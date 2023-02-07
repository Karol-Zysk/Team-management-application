import { User } from '@prisma/client';
import { ClockifyService } from '../clockify/clockify.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto, SalaryHistoryInput, UpdateEmployeeDto } from './dto';
export declare class EmployeeService {
    private readonly prisma;
    private clockify;
    constructor(prisma: PrismaService, clockify: ClockifyService);
    syncClockifyEmployees(user: User): Promise<any>;
    createEmployee(dto: CreateEmployeeDto, user: User): Promise<import(".prisma/client").Employee>;
    updateEmployee(dto: UpdateEmployeeDto, user: User, employeeId: string): Promise<string>;
    getAllEmployess(user: User): Promise<import(".prisma/client").Employee[]>;
    getEmployeeById(user: User, employeeId: string): Promise<import(".prisma/client").Employee>;
    deleteEmployeeById(user: User, employeeId: string): Promise<void>;
    addSalaryHistory(employeeId: string, dto: SalaryHistoryInput): Promise<import(".prisma/client").SalaryHistory>;
}
