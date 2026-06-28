import type {ProjectType} from "../types.ts";

type Props = {
    project: ProjectType
    setProjectId: (projectId: string) => void,
    projectId: string | null,
    // currentProject: string | null,
    // setCurrentProject: (currentProjectId: string) => void,
}

export function Project(props: Props) {

    return (
        <li
            style={{
                color: props.projectId === props.project.id
                    ? 'gold'
                    : 'white',
                cursor: 'pointer',
            }}
            onClick={() => {
                props.setProjectId(props.project.id);
                // props.setCurrentProject(props.project.id)
            }}
        >
            <h3>  {props.project.title}</h3>
        </li>
    )
}