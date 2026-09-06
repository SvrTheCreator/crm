import { useState } from 'react';
import { Sidebar } from '../../widgets/Sidebar.tsx';
import { TaskList } from '../../features/tasks/components/TaskList.tsx';
import { useProjectUsers } from '../../features/projects/hooks/useProjectUsers.ts';
import { useUsers } from '../../features/users/hooks/useUsers.ts';

export function Workspace() {
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    const { users } = useUsers();

    const { projectUsers, otherUsers } = useProjectUsers({
        projectId: selectedProjectId,
        users: users,
    });

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar
                projectId={selectedProjectId}
                setProjectId={setSelectedProjectId}
                otherUsers={otherUsers}
            />
            <TaskList projectId={selectedProjectId} projectUsers={projectUsers} />
        </div>
    );
}
