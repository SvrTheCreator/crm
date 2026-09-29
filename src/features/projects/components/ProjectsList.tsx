import { Project } from './Project.tsx';
import { useState } from 'react';
import type { ProjectType } from '../types.ts';
import { useUsers } from '../../users/hooks/useUsers.ts';
import type { UsersType } from '../../users/types.ts';
import { NavLink, useParams } from 'react-router';
import type { UpdateField, UpdateValue } from '@/features/tasks/types.ts';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar.tsx';

type Props = {
    projectsList: ProjectType[];
    error: string;
    handleUpdateProject: (d: string, field: UpdateField, value: UpdateValue) => void;
    handleDeleteProject: (projectId: string) => void;
    otherUsers: UsersType[];
    projectUsers: UsersType[];
    addMember: (userId: string) => Promise<void>;
    removeMember: (userId: string) => Promise<void>;
};

export function ProjectsList(props: Props) {
    const [openPanel, setOpenPanel] = useState<{
        projectId: string;
        kind: 'edit' | 'add' | 'remove';
    } | null>(null);
    const { projectId } = useParams();

    const { users } = useUsers();

    return props.error !== '' ? (
        props.error
    ) : (
        <div>
            <SidebarMenu>
                {props.projectsList.map((project: ProjectType) => (
                    <SidebarMenuItem key={project.title}>
                        <SidebarMenuButton isActive={projectId === project.id}>
                            <NavLink to={`/projects/${project.id}`}>{project.title}</NavLink>
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
