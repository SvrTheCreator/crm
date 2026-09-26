import { Project } from './Project.tsx';
import { useState } from 'react';
import type { ProjectType } from '../types.ts';
import { useUsers } from '../../users/hooks/useUsers.ts';
import type { UsersType } from '../../users/types.ts';
import { NavLink } from 'react-router';
import type { UpdateField, UpdateValue } from '@/features/tasks/types.ts';

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

    const { users } = useUsers();

    return props.error !== '' ? (
        props.error
    ) : (
        <div>
            <ul>
                {props.projectsList.map((project: ProjectType) => (
                    <NavLink
                        to={`/projects/${project.id}`}
                        key={project.id}
                        className={({ isActive, isPending }) =>
                            isPending ? 'pending' : isActive ? 'active' : ''
                        }
                    >
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
                    </NavLink>
                ))}
            </ul>
        </div>
    );
}
