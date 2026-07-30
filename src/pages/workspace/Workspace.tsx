import { useState } from 'react';
import { Sidebar } from '../../widgets/Sidebar.tsx';
import { TaskList } from '../../features/tasks/components/TaskList.tsx';

export function Workspace() {
    const [projectId, setProjectId] = useState<string | null>(null);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar projectId={projectId} setProjectId={setProjectId} />
            <TaskList projectId={projectId} />
        </div>
    );
}
