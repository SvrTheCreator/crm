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
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
} from '@/components/ui/sidebar.tsx';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import Add01Icon from '@hugeicons/core-free-icons/Add01Icon';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog.tsx';
import { AddProject } from '@/features/projects/components/AddProject.tsx';
import { useProjects } from '@/features/projects/hooks/useProjects.tsx';
import { useState } from 'react';
import type { CreateProjectType } from '@/features/projects/types.ts';

type Props = {
    otherUsers: UsersType[];
    projectUsers: UsersType[];
    addMember: (userId: string) => Promise<void>;
    removeMember: (userId: string) => Promise<void>;
};

export function AppSidebar(props: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const { projectsList, error, handleUpdateProject, handleCreateProject, handleDeleteProject } =
        useProjects();

    const onCreate = async (project: CreateProjectType) => {
        const error = await handleCreateProject(project);
        if (!error) setIsOpen(false);
    };

    return (
        <Sidebar>
            <SidebarHeader>
                <h2>Sprinta</h2>
            </SidebarHeader>
            <SidebarContent>
                <Collapsible defaultOpen className="group/collapsible">
                    <SidebarGroup>
                        <SidebarGroupLabel
                            className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            render={<CollapsibleTrigger />}
                        >
                            Projects
                            <HugeiconsIcon
                                icon={ArrowRight01Icon}
                                strokeWidth={2}
                                className="ml-auto transition-transform group-data-open/collapsible:rotate-90"
                            />
                        </SidebarGroupLabel>
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger render={<SidebarGroupAction className="right-10" />}>
                                <Tooltip>
                                    <TooltipTrigger
                                        render={
                                            <HugeiconsIcon icon={Add01Icon}>Hover</HugeiconsIcon>
                                        }
                                    />
                                    <TooltipContent>
                                        <p>Add new project</p>
                                    </TooltipContent>
                                </Tooltip>
                            </DialogTrigger>
                            <DialogContent>
                                <AddProject handleCreateProject={onCreate} />
                            </DialogContent>
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
        </Sidebar>
    );
}
