import { useEffect, useState } from 'react';
// import { projectsMock } from '../../../dal/api.tsx';
import { Project } from './Project.tsx';
import { AddProject } from './AddProject.tsx';
import type { CreateProjectType, ProjectType } from '../types.ts';
import { supabase } from '../../../utils/supabase.ts';

type Props = {
    setProjectId: (id: string) => void;
    projectId: string | null;
};

export function ProjectsList(props: Props) {
    const [projects, setProjects] = useState<Array<ProjectType>>([]);
    const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);

    useEffect(() => {
        async function getProjects() {
            const response = await supabase.from('projects').select();

            if (response.error) {
                console.error(response.error);
                return;
            }

            if (response.data) {
                setProjects(response.data);
            }
        }
        getProjects();
    }, []);

    async function handleAddProject(newProject: CreateProjectType) {
        const response = await supabase.from('projects').insert(newProject).select().single();

        if (response.error) {
            console.error(response.error);
            return;
        }

        if (response.data) {
            setProjects([...projects, response.data]);
            setIsAddProjectOpen(false);
            props.setProjectId(response.data.id);
        }
    }

    async function handleRemoveProject(projectId: string) {
        const response = await supabase.from('projects').delete().eq('id', projectId);
        console.log(response.data);

        if (response.error) {
            console.error(response.error);
            return;
        }

        setProjects(projects.filter((item) => item.id !== projectId));
    }
    async function handleEditProject(newProjectName: ProjectType) {
        const response = await supabase
            .from('projects')
            .update({ title: newProjectName.title })
            .eq('id', newProjectName.id)
            .select();

        if (response.error) {
            console.error(response.error);
            return;
        }

        if (response.data) {
            const renamedProject = projects.map((item) => {
                if (item.id === newProjectName.id) {
                    return {
                        ...item,
                        title: newProjectName.title,
                    };
                } else {
                    return item;
                }
            });
            setProjects(renamedProject);
        }
        console.log(newProjectName);
    }

    return (
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
                    <AddProject handleAddProject={handleAddProject} />
                </div>
            )}
            <ul>
                {projects.map((project) => (
                    <Project
                        key={project.id}
                        setProjectId={props.setProjectId}
                        project={project}
                        projectId={props.projectId}
                        handleRemoveProject={handleRemoveProject}
                        handleEditProject={handleEditProject}
                    />
                ))}
            </ul>
        </div>
    );
}
