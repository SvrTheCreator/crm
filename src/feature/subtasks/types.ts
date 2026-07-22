import type { Priority, Status } from '../tasks/types.ts';

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
