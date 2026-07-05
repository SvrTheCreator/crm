import type { Priority, Status } from '../tasks/types.ts';

export type SubtaskType = {
    id: string;
    taskId: string;
    title: string;
    assignee: string;
    priority: Priority;
    status: Status;
};
