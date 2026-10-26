import { Project, type OpenPanelType } from './Project.tsx';
import { useState } from 'react';
import type { ProjectType } from '../types.ts';
import { useUsers } from '../../users/hooks/useUsers.ts';
import type { UsersType } from '../../users/types.ts';
import { NavLink, useParams } from 'react-router';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar.tsx';
import type { PostgrestError } from '@supabase/supabase-js';
import type { UpdateField, UpdateValue } from '@/shared/types.ts';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';

type Props = {
    projectsList: ProjectType[];
    error: string;
    handleUpdateProject: (d: string, field: UpdateField, value: UpdateValue) => void;
    handleDeleteProject: (projectId: string) => void;
    otherUsers: UsersType[];
    projectUsers: UsersType[];
    addMember: (userId: string) => Promise<PostgrestError | null | undefined>;
    removeMember: (userId: string) => Promise<PostgrestError | null | undefined>;
};

export function ProjectsList(props: Props) {
    const [openPanel, setOpenPanel] = useState<OpenPanelType>(null);
    const { projectId } = useParams();

    const { users } = useUsers();

    return props.error !== '' ? (
        props.error
    ) : (
        <div>
            <SidebarMenu>
                {props.projectsList.map((project: ProjectType) => (
                    <SidebarMenuItem key={project.id}>
                        <SidebarMenuButton
                            className="pr-0"
                            render={<div />}
                            isActive={projectId === project.id}
                        >
                            <Tooltip>
                                <TooltipTrigger
                                    render={
                                        <SidebarMenuButton
                                            className="truncate"
                                            render={<NavLink to={`/projects/${project.id}`} />}
                                            isActive={projectId === project.id}
                                        />
                                    }
                                >
                                    {project.title}
                                </TooltipTrigger>
                                <TooltipContent>{project.title}</TooltipContent>
                            </Tooltip>
                            <Project
                                key={project.id}
                                project={project}
                                otherUsers={props.otherUsers}
                                handleDeleteProject={props.handleDeleteProject}
                                handleUpdateProject={props.handleUpdateProject}
                                users={users}
                                openPanel={openPanel}
                                setOpenPanel={setOpenPanel}
                                projectUsers={props.projectUsers}
                                addMember={props.addMember}
                                removeMember={props.removeMember}
                            />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </div>
    );
}
