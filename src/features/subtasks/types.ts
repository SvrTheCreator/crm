import type { Priority, Status } from '@/shared/types.ts';

export type SubtaskType = {
    id: string;
    task_id: string;
    title: string;
    description: string | null;
    assignee: string | null;
    priority: Priority;
    due_date: string | null;
    status: Status;
};
export type CreateSubtaskType = {
    task_id: string;
    title: string;
    description: string | null;
    assignee: string | null;
    priority: Priority;
    due_date: string | null;
    status: Status;
};

export type SubtaskFormValues = {
    title: string;
    description: string | null;
    assignee: string | null;
    priority: Priority;
    status: Status;
    due_date: Date | undefined;
};
