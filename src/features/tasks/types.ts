import type { Priority, Status } from '@/shared/types.ts';

export type TaskType = {
    id: string;
    project_id: string;
    title: string;
    description: string | null;
    assignee: string | null;
    priority: Priority;
    due_date: string | null;
    status: Status;
};

export type CreateTaskType = {
    project_id: string;
    title: string;
    description: string | null;
    assignee: string | null;
    priority: Priority;
    due_date: string | null;
    status: Status;
};

export type EditedFieldType = {
    title: string;
    description: string | null;
};

export type TaskFormValues = {
    title: string;
    description: string | null;
    assignee: string | null;
    priority: Priority;
    status: Status;
    due_date: Date | undefined;
};
