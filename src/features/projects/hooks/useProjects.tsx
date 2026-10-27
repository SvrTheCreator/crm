import { useEffect, useState } from 'react';
import {
    createProject,
    deleteProject,
    readProjects,
    updateProject,
} from '@/features/projects/api.ts';
import type { CreateProjectType, ProjectType } from '@/features/projects/types.ts';
import type { UpdateField, UpdateValue } from '@/shared/types.ts';
import { toast } from '@/components/ui/toast.tsx';
import { retryOnce } from '@/shared/utils/retryOnce.ts';

export function useProjects() {
    const [projectsList, setProjectsList] = useState<Array<ProjectType>>([]);
    const [error, setError] = useState('');
    useEffect(() => {
        async function load() {
            const { data, error } = await retryOnce(readProjects);

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
            toast.add({
                type: 'error',
                description: `Failed to create project`,
            });
            return error;
        }
        if (data) {
            setProjectsList([data, ...projectsList]);
            toast.add({
                type: 'success',
                description: `Project created`,
            });
        }
    }

    async function handleDeleteProject(projectId: string) {
        const { data, error } = await deleteProject(projectId);

        if (error !== null) {
            return;
        }
        if (data?.length === 0) {
            toast.add({
                type: 'error',
                description: `Failed to delete project`,
            });
            return;
        }
        setProjectsList(projectsList.filter((item) => item.id !== projectId));
        toast.add({
            type: 'success',
            description: `Project deleted`,
        });
    }

    async function handleUpdateProject(id: string, field: UpdateField, value: UpdateValue) {
        const { data, error } = await updateProject(id, field, value);

        if (error !== null) {
            toast.add({
                type: 'error',
                description: `Failed to update project`,
            });
            return;
        }
        if (data?.length === 0) {
            toast.add({
                type: 'error',
                description: `You don't have permission to do this`,
            });
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
        toast.add({
            type: 'success',
            description: `Project updated`,
        });
    }

    return { projectsList, error, handleUpdateProject, handleCreateProject, handleDeleteProject };
}
