import type { ProjectType } from '../types.ts';
import { useState } from 'react';
import type { UpdateField, UpdateValue } from '../../tasks/types.ts';

import { addMembership } from '../api.ts';
import type { UsersType } from '../../users/types.ts';

type Props = {
    project: ProjectType;
    setProjectId: (projectId: string) => void;
    selectedProjectId: string | null;
    otherUsers: UsersType[];
    handleDeleteProject: (projectId: string) => void;
    handleUpdateProject: (id: string, field: UpdateField, value: UpdateValue) => void;
    users: UsersType[];
    isAddUser: string | null;
    setIsAddUser: (isAddUser: string | null) => void;
    isEdit: string | null;
    setIsEdit: (isEdit: string | null) => void;
};

const flex = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
};

export function Project(props: Props) {
    const [newProjectName, setNewProjectName] = useState(props.project.title);

    const currentProjectAddUser = props.isAddUser === props.project.id;
    const currentProjectIsEdit = props.isEdit === props.project.id;

    const handleFieldChange = () => {
        props.handleUpdateProject(props.project.id, 'title', newProjectName);
        props.setIsEdit(null);
    };

    async function handleAddNewUser(event: React.ChangeEvent<HTMLSelectElement>) {
        const { error } = await addMembership(event.target.value, props.project.id);
        if (error !== null) {
            alert(error.message);
            return;
        }
        props.setIsAddUser(null);
    }

    return (
        <>
            <li
                style={{
                    color: props.selectedProjectId === props.project.id ? 'gold' : 'white',
                    cursor: 'pointer',
                }}
            >
                {currentProjectIsEdit && (
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
                                props.setIsEdit(null);
                            }}
                        >
                            ❌
                        </button>
                    </div>
                )}
                {!currentProjectIsEdit && (
                    <div
                        onClick={() => {
                            props.setProjectId(props.project.id);
                        }}
                        style={flex}
                    >
                        <h3> {props.project.title}</h3>
                        <div style={flex}>
                            <div onClick={() => props.setIsEdit(props.project.id)}>✏️</div>️
                            <div onClick={() => props.handleDeleteProject(props.project.id)}>
                                🗑️
                            </div>
                            ️
                            <div
                                onClick={() => {
                                    props.setIsAddUser(props.project.id);
                                }}
                            >
                                ➕
                            </div>
                            ️
                        </div>
                    </div>
                )}
            </li>
            {currentProjectAddUser && props.otherUsers.length === 0 && (
                <div>Все возможные добавлены</div>
            )}
            {currentProjectAddUser && props.otherUsers.length > 0 && (
                <div>
                    <select onChange={(event) => handleAddNewUser(event)}>
                        <option value="">Выберите пользователя</option>
                        {props.otherUsers.map((user) => {
                            const fullName = `${user.first_name} ${user.last_name}`;
                            return (
                                <option key={user.id} value={user.id}>
                                    {fullName}
                                </option>
                            );
                        })}
                    </select>
                </div>
            )}
        </>
    );
}
