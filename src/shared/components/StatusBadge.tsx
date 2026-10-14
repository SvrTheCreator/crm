import { statusColor } from '@/shared/constants.ts';
import { cn } from '@/lib/utils.ts';
import type { Status } from '@/shared/types.ts';

type Props = {
    value: Status;
};

export function StatusBadge({ value }: Props) {
    const { Icon, color } = statusColor[value];
    return (
        <span className="flex items-center gap-2">
            <Icon className={cn('size-4', color)} />
            {value}
        </span>
    );
}
