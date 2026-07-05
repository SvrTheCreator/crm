import { Sidebar } from '../layers/Sidebar.tsx';
import { TaskList } from '../tasks/components/TaskList.tsx';
import { useState } from 'react';

export function Workspace() {
    const [projectId, setProjectId] = useState<string | null>(null);

    return (
        <>
            <Sidebar projectId={projectId} setProjectId={setProjectId} />
            <TaskList projectId={projectId} />
        </>
    );
}
