export type TaskType = {
    id: string;
    project_id: string;
    title: string;
    description: string;
    assignee: string | null;
    priority: Priority;
    due_date: string | null;
    status: Status;
};

export type CreateTaskType = {
    project_id: string;
    title: string;
    description: string;
    assignee: string | null;
    priority: Priority;
    due_date: string;
    status: Status;
};

export type UsersType = {
    id: string;
    name: string;
};

export type Priority = 'Low' | 'Medium' | 'High';

export type Status = 'To Do' | 'In progress' | 'Done';

export type SortField = 'title' | 'priority' | 'status';

export type UpdateField = 'priority' | 'status' | 'assignee';

export type UpdateValue = Priority | Status | TaskType['assignee'];
