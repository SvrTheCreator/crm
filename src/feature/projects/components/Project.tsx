import type { ProjectType } from '../types.ts';
import { useState } from 'react';

type Props = {
    project: ProjectType;
    setProjectId: (projectId: string) => void;
    projectId: string | null;
    handleRemoveProject: (projectId: string) => void;
    handleEditProject: (newProjectName: ProjectType) => void;
};

const flex = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
};

const errorName = {
    border: '2px solid red',
};

export function Project(props: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [chooseName, setChooseName] = useState(true);

    const renameProject = (project: ProjectType) => {
        if (!project.title.trim().length) {
            setChooseName(false);
            return;
        }

        props.handleEditProject(project);
        setIsEditing(false);
        setChooseName(true);
    };

    return (
        <li
            style={{
                color: props.projectId === props.project.id ? 'gold' : 'white',
                cursor: 'pointer',
            }}
            // onClick={() => {
            //     props.setProjectId(props.project.id);
            // }}
        >
            {isEditing ? (
                <div style={{ display: 'flex' }}>
                    <input
                        style={chooseName ? undefined : errorName}
                        value={newProjectName}
                        onChange={(event) => {
                            setNewProjectName(event.target.value);
                        }}
                        placeholder={props.project.title}
                        type="text"
                    />
                    <button
                        onClick={() =>
                            renameProject({ id: props.project.id, title: newProjectName })
                        }
                    >
                        💾
                    </button>
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            setChooseName(true);
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
                        <div onClick={() => setIsEditing(true)}>✏️</div>️
                        <div onClick={() => props.handleRemoveProject(props.project.id)}>🗑️</div>️
                    </div>
                </div>
            )}
        </li>
    );
}
