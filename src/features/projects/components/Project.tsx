import type { ProjectType } from '../types.ts';
import { useState } from 'react';
import type { UpdateField, UpdateValue } from '../../tasks/types.ts';

import type { UsersType } from '../../users/types.ts';
import { ProjectMembers } from './ProjectMembers.tsx';

type Props = {
    project: ProjectType;
    otherUsers: UsersType[];
    projectUsers: UsersType[];
    handleDeleteProject: (projectId: string) => void;
    handleUpdateProject: (id: string, field: UpdateField, value: UpdateValue) => void;
    users: UsersType[];
    openPanel: OpenPanelType;
    setOpenPanel: (openPanel: OpenPanelType) => void;
    addMember: (userId: string) => Promise<void>;
    removeMember: (userId: string) => Promise<void>;
};

export type OpenPanelType = {
    projectId: string;
    kind: 'edit' | 'add' | 'remove';
} | null;

const flex = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
};

export function Project(props: Props) {
    const [newProjectName, setNewProjectName] = useState(props.project.title);

    const currentProjectAddUser =
        props.openPanel?.projectId === props.project.id && props.openPanel.kind === 'add';
    const currentProjectRemoveUser =
        props.openPanel?.projectId === props.project.id && props.openPanel.kind === 'remove';
    const currentProjectIsEdit =
        props.openPanel?.projectId === props.project.id && props.openPanel.kind === 'edit';

    const handleFieldChange = () => {
        props.handleUpdateProject(props.project.id, 'title', newProjectName);
        props.setOpenPanel(null);
    };

    const toggleMenu = (propsMenu: { projectId: string; kind: 'edit' | 'add' | 'remove' }) => {
        return props.openPanel?.kind === propsMenu.kind &&
            props.openPanel.projectId === propsMenu.projectId
            ? props.setOpenPanel(null)
            : props.setOpenPanel(propsMenu);
    };

    return (
        <>
            <li
                style={{
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
                                props.setOpenPanel(null);
                            }}
                        >
                            ❌
                        </button>
                    </div>
                )}
                {!currentProjectIsEdit && (
                    <div style={flex}>
                        <h3> {props.project.title}</h3>
                        <div style={flex}>
                            <div
                                onClick={() =>
                                    props.setOpenPanel({
                                        projectId: props.project.id,
                                        kind: 'edit',
                                    })
                                }
                            >
                                ✏️
                            </div>
                            ️
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
                                        toggleMenu({
                                            projectId: props.project.id,
                                            kind: 'add',
                                        });
                                    }}
                                >
                                    Add to project
                                </button>

                                <ProjectMembers
                                    users={props.otherUsers}
                                    onSelect={(userId) => props.addMember(userId)}
                                    isOpen={currentProjectAddUser}
                                />
                                <button
                                    onClick={() => {
                                        toggleMenu({
                                            projectId: props.project.id,
                                            kind: 'remove',
                                        });
                                    }}
                                >
                                    Remove from project
                                </button>
                                <ProjectMembers
                                    users={props.projectUsers.filter((user) => {
                                        return user.id !== props.project.owner_id;
                                    })}
                                    onSelect={props.removeMember}
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
