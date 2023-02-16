import { User } from '@prisma/client';
import { CryptoService } from '../cryptography/crypto.service';
import { EmployeesSalaryReporDto } from '../employee/dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto, ReportParamsDto } from '../projects/dto';
import { SalaryParamsDto } from '../salary/dto';
export declare class ClockifyService {
    private cryptoService;
    private prisma;
    private clockify;
    constructor(cryptoService: CryptoService, prisma: PrismaService);
    initClockify(user: User): Promise<{
        workspaceId: string;
    }>;
    getEmployees(user: User): Promise<{
        employees: import("clockify-ts/dist/cjs/Types/MemberType").MemberType[];
        workspaceId: string;
    }>;
    getAllProjects(user: User): Promise<import("clockify-ts/dist/cjs/Types/ProjectType").ProjectType[]>;
    getProjectById(user: User, projectId: string): Promise<import("clockify-ts/dist/cjs/Types/ProjectType").ProjectType>;
    createProject(user: User, dto: CreateProjectDto): Promise<import("clockify-ts/dist/cjs/Types/ProjectType").ProjectType>;
    updateProject(user: User, dto: UpdateProjectDto, projectId: string): Promise<import("clockify-ts/dist/cjs/Types/ProjectType").ProjectType>;
    deleteProject(user: User, projectId: string): Promise<void>;
    calculateSalary(clockifyId: string, user: User, dto?: any, date?: {
        start: Date;
        end: Date;
    }): Promise<import(".prisma/client").Employee>;
    geEmployeesSalary(user: User, dto: SalaryParamsDto): Promise<{
        employeesWithSalary: import(".prisma/client").Employee[];
        workspaceId: string;
    }>;
    geEmployeeSalaryById(user: User, dto: SalaryParamsDto, employeeId: string): Promise<import(".prisma/client").Employee>;
    projectReport(user: User, projectId: string, dto: ReportParamsDto): Promise<any>;
    employeesSalaryReport(user: User, dto: EmployeesSalaryReporDto): Promise<import(".prisma/client").Report>;
    getAllProjectReports(user: User): Promise<import(".prisma/client").Project[]>;
    getAllEmployeeSalaryReports(user: User): Promise<import(".prisma/client").Report[]>;
}
