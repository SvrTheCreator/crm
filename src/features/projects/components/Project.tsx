import type { ProjectType } from '../types.ts';
import { useState } from 'react';
import type { UpdateField, UpdateValue } from '../../tasks/types.ts';

import { addMembership, removeMembership } from '../api.ts';
import type { UsersType } from '../../users/types.ts';
import { ProjectMembers } from './ProjectMembers.tsx';

type Props = {
    project: ProjectType;
    setProjectId: (projectId: string) => void;
    selectedProjectId: string | null;
    otherUsers: UsersType[];
    projectUsers: UsersType[];
    handleDeleteProject: (projectId: string) => void;
    handleUpdateProject: (id: string, field: UpdateField, value: UpdateValue) => void;
    users: UsersType[];
    isAddUser: string | null;
    setIsAddUser: (isAddUser: string | null) => void;
    isEdit: string | null;
    setIsEdit: (isEdit: string | null) => void;
    isRemoveUser: string | null;
    setIsRemoveUser: (isRemoveUser: string | null) => void;
};

const flex = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
};

export function Project(props: Props) {
    const [newProjectName, setNewProjectName] = useState(props.project.title);

    const currentProjectAddUser = props.isAddUser === props.project.id;
    const currentProjectRemoveUser = props.isRemoveUser === props.project.id;
    const currentProjectIsEdit = props.isEdit === props.project.id;

    const handleFieldChange = () => {
        props.handleUpdateProject(props.project.id, 'title', newProjectName);
        props.setIsEdit(null);
    };
    async function handleMembership(
        userId: string,
        changeMembership: typeof addMembership,
        setMenu: (value: string | null) => void,
    ) {
        const { error } = await changeMembership(userId, props.project.id);
        if (error !== null) {
            alert(error.message);
            return;
        }
        setMenu(null);
    }

    const toggleMenu = (menu: Props['isEdit'], setMenu: Props['setIsEdit'], propsMenu: string) => {
        return menu ? setMenu(null) : setMenu(propsMenu);
    };

    return (
        <>
            <li
                style={{
                    color: props.selectedProjectId === props.project.id ? 'gold' : 'white',
                    cursor: 'pointer',
                    border: '1px solid gray',
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
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <button
                                    onClick={() => {
                                        toggleMenu(
                                            props.isAddUser,
                                            props.setIsAddUser,
                                            props.project.id,
                                        );
                                    }}
                                >
                                    Add to project
                                </button>

                                <ProjectMembers
                                    users={props.otherUsers}
                                    onSelect={(userId) =>
                                        handleMembership(userId, addMembership, props.setIsAddUser)
                                    }
                                    isOpen={currentProjectAddUser}
                                />
                                <button
                                    onClick={() => {
                                        toggleMenu(
                                            props.isRemoveUser,
                                            props.setIsRemoveUser,
                                            props.project.id,
                                        );
                                    }}
                                >
                                    Remove from project
                                </button>
                                <ProjectMembers
                                    users={props.projectUsers}
                                    onSelect={(userId) =>
                                        handleMembership(
                                            userId,
                                            removeMembership,
                                            props.setIsRemoveUser,
                                        )
                                    }
                                    isOpen={currentProjectRemoveUser}
                                />
                            </div>
                            ️
                        </div>
                    </div>
                )}
            </li>
        </>
    );
}
