import { Spinner } from '@/components/ui/spinner.tsx';

export function FullPageSpinner() {
    return (
        <div className="flex min-h-svh items-center justify-center">
            <Spinner className="size-8 text-muted-foreground" />
        </div>
    );
}
