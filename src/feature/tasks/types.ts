export type Task = {
    id: string;
    projectId: string;
    title: string;
    description: string;
    assignee: string[];
    priority: Priority;
    dueDate: string;
    status: Status;
};

export type Priority = "Low" | "Medium" | "High";

export type Status = "To Do" | "In progress" | "Done";

export type SortField = "title" | "priority" | "status";

export type UpdateTaskField = "priority" | "status";

export type UpdateTaskValue = Priority | Status;