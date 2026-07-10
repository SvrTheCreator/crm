import type { ProjectType } from '../types.ts';

type Props = {
    project: ProjectType;
    setProjectId: (projectId: string) => void;
    projectId: string | null;
    handleRemoveProject: (projectId: string) => void;
};

const flex = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
};

export function Project(props: Props) {
    return (
        <li
            style={{
                color: props.projectId === props.project.id ? 'gold' : 'white',
                cursor: 'pointer',
            }}
            onClick={() => {
                props.setProjectId(props.project.id);
            }}
        >
            <div style={flex}>
                <h3> {props.project.title}</h3>
                <div style={flex}>
                    <div>✏️</div>️
                    <div onClick={() => props.handleRemoveProject(props.project.id)}>❌</div>️
                </div>
            </div>
        </li>
    );
}
