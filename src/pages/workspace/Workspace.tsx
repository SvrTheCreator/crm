import { AppSidebar } from '../../widgets/AppSidebar.tsx';
import { Outlet, useParams } from 'react-router';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar.tsx';
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
        <SidebarProvider>
            <AppSidebar
                otherUsers={otherUsers}
                projectUsers={projectUsers}
                addMember={addMember}
                removeMember={removeMember}
            />
            <SidebarInset>
                <Outlet context={{ projectUsers } satisfies ContextType} />
            </SidebarInset>
        </SidebarProvider>
    );
}
