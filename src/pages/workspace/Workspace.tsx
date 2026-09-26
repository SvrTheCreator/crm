import { AppSidebar } from '../../widgets/AppSidebar.tsx';
import { Outlet, useParams } from 'react-router';
import { SidebarProvider } from '@/components/ui/sidebar.tsx';
import type { UsersType } from '@/features/users/types.ts';
import { useUsers } from '@/features/users/hooks/useUsers.ts';
import { useProjectUsers } from '@/features/projects/hooks/useProjectUsers.ts';

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
        <SidebarProvider style={{ display: 'flex' }}>
            <AppSidebar
                otherUsers={otherUsers}
                projectUsers={projectUsers}
                addMember={addMember}
                removeMember={removeMember}
            />
            <Outlet context={{ projectUsers } satisfies ContextType} />
        </SidebarProvider>
    );
}
