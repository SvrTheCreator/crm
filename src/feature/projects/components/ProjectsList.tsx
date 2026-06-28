import {useState} from "react";
import {projectsMock} from "../../../dal/api.tsx";
import {Project} from "./Project.tsx";
import {AddProject} from "./AddProject.tsx";
import type {ProjectType} from "../types.ts";

type Props = {
    setProjectId: (id: string) => void;
    projectId: string | null;
}

export function ProjectsList(props: Props) {
    const [projects, setProjects] = useState<Array<ProjectType>>(projectsMock)
    const [isAddProjectOpen, setIsAddProjectOpen] = useState(false)

    const handleAddProject = (newProject: ProjectType) => {
        setProjects([...projects, newProject])
        setIsAddProjectOpen(false)
        props.setProjectId(newProject.id)
    }

    return (
        <div>
            <div style={{display: "flex", justifyContent: "space-between", marginBottom: '12px'}}>
                <h2>Projects</h2>
                <div>
                    <button onClick={() => {
                        setIsAddProjectOpen(!isAddProjectOpen)
                    }}>Add project
                    </button>
                </div>
            </div>
            {isAddProjectOpen && <div style={{padding: '20px 0'}}>
                <AddProject handleAddProject={handleAddProject}
                />
            </div>}
            <ul>
                {projects.map((project) => (
                    <Project key={project.id}
                             setProjectId={props.setProjectId}
                             project={project}
                             projectId={props.projectId}
                        // setCurrentProject={setCurrentProject}
                        // currentProject={currentProject}
                    />
                ))}
            </ul>
        </div>
    )
}