import type { ProjectType } from '../types.ts';
import { useState } from 'react';
import type { UpdateField, UpdateValue } from '../../tasks/types.ts';

type Props = {
    project: ProjectType;
    setProjectId: (projectId: string) => void;
    projectId: string | null;
    handleDeleteProject: (projectId: string) => void;
    handleUpdateProject: (id: string, field: UpdateField, value: UpdateValue) => void;
};

const flex = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
};

// const errorName = {
//     border: '2px solid red',
// };

export function Project(props: Props) {
    const [isEdit, setIsEdit] = useState(false);
    const [newProjectName, setNewProjectName] = useState(props.project.title);

    const handleFieldChange = () => {
        props.handleUpdateProject(props.project.id, 'title', newProjectName);
        setIsEdit(false);
    };

    return (
        <li
            style={{
                color: props.projectId === props.project.id ? 'gold' : 'white',
                cursor: 'pointer',
            }}
        >
            {isEdit ? (
                <div style={{ display: 'flex' }}>
                    <input
                        value={newProjectName}
                        onChange={(event) => {
                            setNewProjectName(event.target.value);
                        }}
                        type="text"
                    />
                    <button onClick={() => handleFieldChange()}>💾</button>
                    <button
                        onClick={() => {
                            setNewProjectName(props.project.title);
                            setIsEdit(false);
                        }}
                    >
                        ❌
                    </button>
                </div>
            ) : (
                <div
                    onClick={() => {
                        props.setProjectId(props.project.id);
                    }}
                    style={flex}
                >
                    <h3> {props.project.title}</h3>
                    <div style={flex}>
                        <div onClick={() => setIsEdit(true)}>✏️</div>️
                        <div onClick={() => props.handleDeleteProject(props.project.id)}>🗑️</div>️
                    </div>
                </div>
            )}
        </li>
    );
}
