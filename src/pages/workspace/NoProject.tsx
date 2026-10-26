import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty.tsx';
import { FolderOpen } from 'lucide-react';

export function NoProject() {
    return (
        <Empty className="h-full">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <FolderOpen />
                </EmptyMedia>
                <EmptyTitle>No project selected</EmptyTitle>
                <EmptyDescription>
                    Pick a project in the sidebar to see its tasks, or create a new one with the
                    plus button.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
}
