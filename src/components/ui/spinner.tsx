import { cn } from 'cn';
import { HugeiconsIcon } from '@hugeicons/react';
import { LoaderCircle } from 'lucide-react';

function Spinner({
    className,
    ...props
}: Omit<React.ComponentProps<typeof HugeiconsIcon>, 'icon'>) {
    return (
        <LoaderCircle
            strokeWidth={2}
            data-slot="spinner"
            role="status"
            aria-label="Loading"
            className={cn('size-4 animate-spin', className)}
            {...props}
        />
    );
}

export { Spinner };
