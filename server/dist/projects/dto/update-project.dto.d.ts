export declare class UpdateProjectDto {
    name: string;
    clientId: string;
    isPublic: boolean;
    hourlyRate: {
        amount: number;
    };
    color: string;
    note: string;
    billable: boolean;
    archived: boolean;
}
