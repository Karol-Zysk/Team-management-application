export interface ProjectReport {
  id: string;
  createdAt: string;
  updatedAt: string;
  clientName: string;
  clientId: string;
  projectId: string;
  active: boolean;
  projectName: string;
  projectStartDate: string;
  duration: number;
  budgetEstimate: number;
  timeEstimate: number;
  expenses: number;
  note: string;
  memberships: Membership[];
  summary: number;
  userId: string;
}

interface Membership {
  clockifyId: string;
  clockifyName: string;
  hoursWorked: number;
  hourlyRate: number;
  salary: number;
  profilePicture: string;
}
