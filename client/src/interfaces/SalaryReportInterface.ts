export interface SalaryReportInterface {
  clockifyId: string;
  clockifyName: string;
  createdAt: string;
  email: string;
  firstName: string;
  hourlyRate: number;
  hoursWorked: number;
  id: string;
  lastName: string;
  profilePicture: string;
  salary: number;
  updatedAt: string;
  userId: string;
  workspaceId: string;
}

interface Employee {
  clockifyName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  hourlyRate: number;
  hoursWorked: number;
  salary: number;
}

export interface TeamReport {
  createdAt: string;
  employees: Employee[];
  id: string;
  reportName: string;
  updatedAt: string;
  userId: string;
}
