import type { Priority, Status } from '@/shared/types.ts';
import { CircleDashed, CircleDashedCheck, CircleDotDashed, type LucideIcon } from 'lucide-react';

export const priorityColor: Record<Priority, string> = {
    Low: 'bg-green-500',
    Medium: 'bg-yellow-500',
    High: 'bg-red-500',
};

export const statusColor: Record<Status, { Icon: LucideIcon; color: string }> = {
    'To Do': { Icon: CircleDashed, color: 'text-red-500' },
    'In progress': { Icon: CircleDotDashed, color: 'text-yellow-500!' },
    Done: { Icon: CircleDashedCheck, color: 'text-green-500' },
};
