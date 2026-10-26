import { ProjectsList } from '../features/projects/components/ProjectsList.tsx';
import type { UsersType } from '../features/users/types.ts';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible.tsx';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar.tsx';
import { SquareKanban } from 'lucide-react';
import { Link } from 'react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import Add01Icon from '@hugeicons/core-free-icons/Add01Icon';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { Dialog, DialogTrigger } from '@/components/ui/dialog.tsx';
import { AddProject } from '@/features/projects/components/AddProject.tsx';
import { useProjects } from '@/features/projects/hooks/useProjects.tsx';
import { useState } from 'react';
import type { CreateProjectType } from '@/features/projects/types.ts';
import type { PostgrestError } from '@supabase/supabase-js';
import { UserMenu } from '@/features/auth/components/UserMenu.tsx';
import { useAuth } from '@/features/auth/hooks/AuthContext.ts';

type Props = {
    otherUsers: UsersType[];
    projectUsers: UsersType[];
    addMember: (userId: string) => Promise<PostgrestError | null | undefined>;
    removeMember: (userId: string) => Promise<PostgrestError | null | undefined>;
} & ReturnType<typeof useProjects>;

export function AppSidebar(props: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const { projectsList, error, handleUpdateProject, handleCreateProject, handleDeleteProject } =
        props;
    const { currentUser } = useAuth();

    const onCreate = async (project: CreateProjectType) => {
        const error = await handleCreateProject(project);
        if (!error) setIsOpen(false);
    };

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" render={<Link to="/projects" />}>
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <SquareKanban className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left leading-tight">
                                <span className="truncate font-medium">Taskflow</span>
                                <span className="truncate text-xs text-muted-foreground">
                                    Pet project
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <Collapsible defaultOpen className="group/collapsible ">
                    <SidebarGroup>
                        <SidebarGroupLabel
                            className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-2"
                            render={<CollapsibleTrigger />}
                        >
                            Projects
                            <HugeiconsIcon
                                icon={ArrowRight01Icon}
                                strokeWidth={2}
                                className="ml-auto transition-transform group-data-open/collapsible:rotate-90 cursor-pointer"
                            />
                        </SidebarGroupLabel>
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger render={<SidebarGroupAction className="right-10" />}>
                                <Tooltip>
                                    <TooltipTrigger
                                        render={
                                            <HugeiconsIcon
                                                className="cursor-pointer"
                                                icon={Add01Icon}
                                            >
                                                Hover
                                            </HugeiconsIcon>
                                        }
                                    />
                                    <TooltipContent>
                                        <p>Add new project</p>
                                    </TooltipContent>
                                </Tooltip>
                            </DialogTrigger>
                            <AddProject handleCreateProject={onCreate} />
                        </Dialog>
                        <CollapsibleContent>
                            <SidebarGroupContent>
                                <ProjectsList
                                    projectsList={projectsList}
                                    error={error}
                                    handleUpdateProject={handleUpdateProject}
                                    handleDeleteProject={handleDeleteProject}

                                    otherUsers={props.otherUsers}
                                    projectUsers={props.projectUsers}
                                    addMember={props.addMember}
                                    removeMember={props.removeMember}
                                />
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </SidebarGroup>
                </Collapsible>
            </SidebarContent>
            <SidebarFooter>{currentUser && <UserMenu currentUser={currentUser} />}</SidebarFooter>
        </Sidebar>
    );
}
