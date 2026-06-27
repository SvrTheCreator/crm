import {useState} from "react";
import {projectsMock} from "../../../dal/api.tsx";
import {Project} from "./Project.tsx";

type Props = {
    setProjectId: (id: string) => void;
}

export function ProjectsList(props: Props) {
    const [projects, setProjects] = useState(projectsMock)


    return (
        <ul>
            {projects.map((project) => (
                <Project key={project.id} setProjectId={props.setProjectId} project={project}/>
            ))}
        </ul>
    )
}