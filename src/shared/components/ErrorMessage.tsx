import { TriangleAlert } from 'lucide-react';

type Props = {
    message: string;
};

export function ErrorMessage({ message }: Props) {
    return (
        <p className="flex items-start gap-2 p-2 text-sm text-destructive">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            {message}
        </p>
    );
}
