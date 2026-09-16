import { Sidebar } from '../../widgets/Sidebar.tsx';
import { useProjectUsers } from '../../features/projects/hooks/useProjectUsers.ts';
import { useUsers } from '../../features/users/hooks/useUsers.ts';
import { Outlet, useParams } from 'react-router';
import type { UsersType } from '../../features/users/types.ts';

export type ContextType = {
    projectUsers: UsersType[];
};

export function Workspace() {
    const params = useParams();

    const { users } = useUsers();

    const { projectUsers, otherUsers, addMember, removeMember } = useProjectUsers({
        projectId: params.projectId ?? null,
        users: users,
    });

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar
                otherUsers={otherUsers}
                projectUsers={projectUsers}
                addMember={addMember}
                removeMember={removeMember}
            />
            <Outlet context={{ projectUsers } satisfies ContextType} />
        </div>
    );
}
