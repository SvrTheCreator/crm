import { useEffect, useState } from 'react';
import {
    createProject,
    deleteProject,
    readProjects,
    updateProject,
} from '@/features/projects/api.ts';
import type { CreateProjectType, ProjectType } from '@/features/projects/types.ts';
import type { UpdateField, UpdateValue } from '@/features/tasks/types.ts';

export function useProjects() {
    const [projectsList, setProjectsList] = useState<Array<ProjectType>>([]);
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
            return error;
        }
        if (data) {
            setProjectsList([data, ...projectsList]);
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

    return { projectsList, error, handleUpdateProject, handleCreateProject, handleDeleteProject };
}
