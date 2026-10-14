import type { TaskType } from '@/features/tasks/types.ts';

export type Priority = 'Low' | 'Medium' | 'High';

export type Status = 'To Do' | 'In progress' | 'Done';

export type SortField = 'title' | 'priority' | 'status';

export type UpdateField = 'priority' | 'status' | 'assignee' | 'due_date' | 'title' | 'description';

export type UpdateValue = Priority | Status | TaskType['assignee'] | TaskType['due_date'];
