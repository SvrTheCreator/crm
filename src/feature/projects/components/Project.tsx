type Props = {
    project: {
        id: string,
        title: string,
    }
    setProjectId: (projectId: string) => void,
}

export function Project(props: Props) {
    return (
        <li
            onClick={() => {
                props.setProjectId(props.project.id);
            }}
        >
            {props.project.title}
        </li>
    )
}