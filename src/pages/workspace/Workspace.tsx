import { AppSidebar } from '../../widgets/AppSidebar.tsx';
import { Link, Outlet, useParams } from 'react-router';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Paperclip } from 'lucide-react';
import { copyCurrentUrl } from '@/shared/utils/copyCurrentUrl.ts';
import type { UsersType } from '@/features/users/types.ts';
import { useUsers } from '@/features/users/hooks/useUsers.ts';
import { useProjectUsers } from '@/features/projects/hooks/useProjectUsers.ts';
import { useProjects } from '@/features/projects/hooks/useProjects.tsx';

export type ContextType = {
    projectUsers: UsersType[];
};

export function Workspace() {
    const params = useParams();

    const { users } = useUsers();

    const projects = useProjects();

    const { projectUsers, otherUsers, addMember, removeMember } = useProjectUsers({
        projectId: params.projectId ?? null,
        users: users,
    });

    const currentProject = projects.projectsList.find(
        (project) => project.id === params.projectId,
    );

    return (
        <SidebarProvider>
            <AppSidebar
                {...projects}
                otherUsers={otherUsers}
                projectUsers={projectUsers}
                addMember={addMember}
                removeMember={removeMember}
            />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                {currentProject ? (
                                    <BreadcrumbLink render={<Link to="/projects" />}>
                                        Projects
                                    </BreadcrumbLink>
                                ) : (
                                    <BreadcrumbPage>Projects</BreadcrumbPage>
                                )}
                            </BreadcrumbItem>
                            {currentProject && (
                                <>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>{currentProject.title}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                    <BreadcrumbItem>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            aria-label="Copy link to project"
                                            onClick={copyCurrentUrl}
                                        >
                                            <Paperclip />
                                        </Button>
                                    </BreadcrumbItem>
                                </>
                            )}
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <Outlet context={{ projectUsers } satisfies ContextType} />
            </SidebarInset>
        </SidebarProvider>
    );
}
