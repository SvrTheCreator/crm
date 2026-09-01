import type { ProjectType } from '../types.ts';
import { useState } from 'react';
import type { UpdateField, UpdateValue, UsersType } from '../../tasks/types.ts';
import { addMembership, getProjectUser } from '../api.ts';

type Props = {
    project: ProjectType;
    setProjectId: (projectId: string) => void;
    projectId: string | null;
    handleDeleteProject: (projectId: string) => void;
    handleUpdateProject: (id: string, field: UpdateField, value: UpdateValue) => void;
    users: UsersType[];
};

const flex = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
};

export function Project(props: Props) {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [newProjectName, setNewProjectName] = useState(props.project.title);
    const [isAddUser, setIsAddUser] = useState<boolean>(false);
    const [optionUsers, setOptionUsers] = useState<UsersType[]>([]);

    const handleFieldChange = () => {
        props.handleUpdateProject(props.project.id, 'title', newProjectName);
        setIsEdit(false);
    };

    async function load() {
        const { data, error } = await getProjectUser(props.project.id);
        if (error !== null) {
            alert(error.message);
            return;
        }
        if (data && props.users) {
            const members = data.map((item) => item.user_id);
            const fulteredMembers = props.users.filter((user) => {
                return !members.includes(user.id) && user.id !== props.project.owner_id;
            });
            setOptionUsers(fulteredMembers);
        }
    }

    async function handleAddNewUser(event: React.ChangeEvent<HTMLSelectElement>) {
        const { error } = await addMembership(event.target.value, props.project.id);
        if (error !== null) {
            alert(error.message);
            return;
        }
        setIsAddUser(false);
    }

    return (
        <>
            <li
                style={{
                    color: props.projectId === props.project.id ? 'gold' : 'white',
                    cursor: 'pointer',
                }}
            >
                {isEdit && (
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
                )}
                {!isEdit && (
                    <div
                        onClick={() => {
                            props.setProjectId(props.project.id);
                        }}
                        style={flex}
                    >
                        <h3> {props.project.title}</h3>
                        <div style={flex}>
                            <div onClick={() => setIsEdit(true)}>✏️</div>️
                            <div onClick={() => props.handleDeleteProject(props.project.id)}>
                                🗑️
                            </div>
                            ️
                            <div
                                onClick={() => {
                                    load();
                                    setIsAddUser(!isAddUser);
                                    // handleAddNewUser();
                                }}
                            >
                                ➕
                            </div>
                            ️
                        </div>
                    </div>
                )}
            </li>
            {isAddUser && optionUsers.length === 0 && <div>Все возможные добавлены</div>}
            {isAddUser && optionUsers.length > 0 && (
                <div>
                    <select onChange={(event) => handleAddNewUser(event)}>
                        <option value="">Выберите пользователя</option>
                        {optionUsers.map((user) => {
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
