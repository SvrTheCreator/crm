import type { ProjectType } from '../types.ts';
import { useState } from 'react';
import type { UpdateField, UpdateValue } from '../../tasks/types.ts';

import type { UsersType } from '../../users/types.ts';
import { ButtonGroup } from '@/components/ui/button-group.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import {
    ArchiveIcon,
    CalendarPlusIcon,
    ClockIcon,
    ListFilterIcon,
    MailCheckIcon,
    MoreHorizontalIcon,
    Trash2Icon,
} from 'lucide-react';
import { ProjectMembers } from '@/features/projects/components/ProjectMembers.tsx';

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
            <div>
                {currentProjectIsEdit && (
                    <div
                        style={{ display: 'flex', position: 'absolute', left: '12px', top: '8px' }}
                    >
                        <input
                            value={newProjectName}
                            onChange={(event) => {
                                setNewProjectName(event.target.value);
                            }}
                            type="text"
                        />
                        <div onClick={() => handleFieldChange()}>💾</div>
                        <div
                            onClick={() => {
                                setNewProjectName(props.project.title);
                                props.setOpenPanel(null);
                            }}
                        >
                            ❌
                        </div>
                    </div>
                )}
                {!currentProjectIsEdit && (
                    <div style={flex}>
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
                            <ButtonGroup>
                                <DropdownMenu>
                                    <DropdownMenuTrigger
                                        render={
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                aria-label="More Options"
                                            >
                                                <MoreHorizontalIcon />
                                            </Button>
                                        }
                                    />
                                    <DropdownMenuContent align="end" className="w-40">
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem>
                                                <MailCheckIcon />
                                                Mark as Read
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <ArchiveIcon />
                                                Archive
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem>
                                                <ClockIcon />
                                                Snooze
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <CalendarPlusIcon />
                                                Add to Calendar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <ListFilterIcon />
                                                Add to List
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem variant="destructive">
                                                <Trash2Icon />
                                                Trash
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </ButtonGroup>
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
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
