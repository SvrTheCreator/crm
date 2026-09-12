import { Project } from './Project.tsx';
import { AddProject } from './AddProject.tsx';
import { useEffect, useState } from 'react';
import type { CreateProjectType, ProjectType } from '../types.ts';
import { createProject, deleteProject, readProjects, updateProject } from '../api.ts';
import type { UpdateField, UpdateValue } from '../../tasks/types.ts';
import { useUsers } from '../../users/hooks/useUsers.ts';
import type { UsersType } from '../../users/types.ts';

type Props = {
    setProjectId: (id: string) => void;
    projectId: string | null;
    otherUsers: UsersType[];
    projectUsers: UsersType[];
    addMember: (userId: string) => Promise<void>;
    removeMember: (userId: string) => Promise<void>;
};

export function ProjectsList(props: Props) {
    const [projectsList, setProjectsList] = useState<Array<ProjectType>>([]);
    const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
    const [error, setError] = useState('');
    const [openPanel, setOpenPanel] = useState<{
        projectId: string;
        kind: 'edit' | 'add' | 'remove';
    } | null>(null);

    const { users } = useUsers();

    useEffect(() => {
        async function load() {
            const { data, error } = await readProjects();

            if (error !== null) {
                setError(error.message);
                return;
            }
            if (data) {
                setProjectsList(data);
            }
        }
        load();
    }, []);

    async function handleCreateProject(project: CreateProjectType) {
        const { data, error } = await createProject(project);

        if (error !== null) {
            console.log(error.message);
            return;
        }
        if (data) {
            setProjectsList([data, ...projectsList]);
            setIsAddProjectOpen(false);
        }
    }

    async function handleDeleteProject(projectId: string) {
        const { data, error } = await deleteProject(projectId);

        if (error !== null) {
            alert(error.message);
            return;
        }
        if (data?.length === 0) {
            alert('Issues with RLS — contact the administrator');
            return;
        }
        setProjectsList(projectsList.filter((item) => item.id !== projectId));
    }

    async function handleUpdateProject(id: string, field: UpdateField, value: UpdateValue) {
        const { data, error } = await updateProject(id, field, value);

        if (error !== null) {
            alert(error.message);
            return;
        }
        if (data?.length === 0) {
            alert('Issues with RLS — contact the administrator');
            return;
        }

        const updateProjectField = projectsList.map((project) => {
            if (project.id === id) {
                return {
                    ...project,
                    [field]: value,
                };
            } else return project;
        });

        setProjectsList(updateProjectField);
    }

    return error !== '' ? (
        error
    ) : (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h2>Projects</h2>
                <div>
                    <button
                        onClick={() => {
                            setIsAddProjectOpen(!isAddProjectOpen);
                        }}
                    >
                        Add project
                    </button>
                </div>
            </div>
            {isAddProjectOpen && (
                <div style={{ padding: '20px 0' }}>
                    <AddProject handleCreateProject={handleCreateProject} />
                </div>
            )}
            <ul>
                {projectsList.map((project: ProjectType) => (
                    <Project
                        key={project.id}
                        setProjectId={props.setProjectId}
                        project={project}
                        selectedProjectId={props.projectId}
                        otherUsers={props.otherUsers}
                        handleDeleteProject={handleDeleteProject}
                        handleUpdateProject={handleUpdateProject}
                        users={users}
                        openPanel={openPanel}
                        setOpenPanel={setOpenPanel}
                        projectUsers={props.projectUsers}
                        addMember={props.addMember}
                        removeMember={props.removeMember}
                    />
                ))}
            </ul>
        </div>
    );
}
