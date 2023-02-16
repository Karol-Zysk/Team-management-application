import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto, SalaryHistoryInput, UpdateEmployeeDto } from './dto';
export declare class EmployeeController {
    private prisma;
    private employeeService;
    constructor(prisma: PrismaService, employeeService: EmployeeService);
    syncClockifyEmployees(user: User): Promise<any>;
    clean(): Promise<[import(".prisma/client").Prisma.BatchPayload, import(".prisma/client").Prisma.BatchPayload, import(".prisma/client").Prisma.BatchPayload, import(".prisma/client").Prisma.BatchPayload, import(".prisma/client").Prisma.BatchPayload]>;
    createEmployee(dto: CreateEmployeeDto, user: User): Promise<import(".prisma/client").Employee>;
    updateEmployee(dto: UpdateEmployeeDto, user: User, employeeId: string): Promise<string>;
    getAllEmployess(user: User): Promise<import(".prisma/client").Employee[]>;
    getEmployeeById(user: User, id: string): Promise<import(".prisma/client").Employee>;
    deleteEmployeeById(user: User, id: string): Promise<void>;
    addSalaryHistory(id: string, dto: SalaryHistoryInput): Promise<import(".prisma/client").SalaryHistory>;
}
