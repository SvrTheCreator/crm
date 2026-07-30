import { Project } from './Project.tsx';
import { AddProject } from './AddProject.tsx';
import { useEffect, useState } from 'react';
import type { CreateProjectType, ProjectType } from '../types.ts';
import { createProject, deleteProject, readProjects, updateProject } from '../api.ts';
import type { UpdateField, UpdateValue } from '../../tasks/types.ts';

type Props = {
    setProjectId: (id: string) => void;
    projectId: string | null;
};

export function ProjectsList(props: Props) {
    const [projectsList, setProjectsList] = useState<Array<ProjectType>>([]);
    const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
    const [error, setError] = useState('');

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
        }
    }

    async function handleDeleteProject(projectId: string) {
        const { error } = await deleteProject(projectId);

        if (error !== null) {
            console.log(error.message);
            return;
        }
        setProjectsList(projectsList.filter((item) => item.id !== projectId));
    }

    async function handleUpdateProject(id: string, field: UpdateField, value: UpdateValue) {
        const { error } = await updateProject(id, field, value);

        if (error !== null) {
            console.error(error.message);
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
                        projectId={props.projectId}
                        handleDeleteProject={handleDeleteProject}
                        handleUpdateProject={handleUpdateProject}
                    />
                ))}
            </ul>
        </div>
    );
}
