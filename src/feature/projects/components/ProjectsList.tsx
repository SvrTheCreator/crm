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
            const response = await supabase.from('projects').select().select();

            if (response.data) {
                setProjects(response.data);
            }
        }
        getProjects();
    }, [projects]);

    async function handleAddProject(newProject: CreateProjectType) {
        // setProjects([...projects, newProject]);
        const response = await supabase.from('projects').insert(newProject).select().single();

        if (response.data) {
            setProjects([...projects, response.data]);
            setIsAddProjectOpen(false);
            props.setProjectId(response.data.id);
        }
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
                        // setCurrentProject={setCurrentProject}
                        // currentProject={currentProject}
                    />
                ))}
            </ul>
        </div>
    );
}
