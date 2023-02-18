export interface Employee {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  firstName: string | null;
  lastName: string | null;
  clockifyName: string | null;
  email?: string;
  hourlyRate: number | null;
  hoursWorked?: number | null;
  salary?: number | null;
  profilePicture?: string | null;
  clockifyId?: string;
  workspaceId?: string;
  userId?: string;
}

export interface EditedEmployee {
  firstName: string;
  lastName: string;
  clockifyName: string;

  hourlyRate: number;

  profilePicture: string;
}
