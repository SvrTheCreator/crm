import { priorityColor } from '@/shared/constants.ts';
import { cn } from '@/lib/utils.ts';
import type { Priority } from '@/shared/types.ts';

type Props = {
    value: Priority;
};

export function PriorityBadge({ value }: Props) {
    const color = priorityColor[value];
    return (
        <>
            <span className={cn('size-2 rounded-full', color)} />
            {value}
        </>
    );
}
