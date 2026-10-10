import type { ProjectType } from '../types.ts';
import type { UpdateField, UpdateValue } from '../../tasks/types.ts';

import type { UsersType } from '../../users/types.ts';
import { ButtonGroup } from '@/components/ui/button-group.tsx';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { EllipsisVertical, Pencil, Trash2Icon, UserMinus, UserPlus } from 'lucide-react';
import { ProjectMembers } from '@/features/projects/components/ProjectMembers.tsx';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog.tsx';
import { RenameProject } from '@/features/projects/components/RenameProject.tsx';
import { toast } from '@/components/ui/toast';
import type { PostgrestError } from '@supabase/supabase-js';

type Props = {
    project: ProjectType;
    otherUsers: UsersType[];
    projectUsers: UsersType[];
    handleDeleteProject: (projectId: string) => void;
    handleUpdateProject: (id: string, field: UpdateField, value: UpdateValue) => void;
    users: UsersType[];
    openPanel: OpenPanelType;
    setOpenPanel: (openPanel: OpenPanelType) => void;
    addMember: (userId: string) => Promise<PostgrestError | null | undefined>;
    removeMember: (userId: string) => Promise<PostgrestError | null | undefined>;
};

export type OpenPanelType = {
    projectId: string;
    kind: 'edit' | 'add' | 'remove';
} | null;

export function Project(props: Props) {
    const currentProjectAddUser =
        props.openPanel?.projectId === props.project.id && props.openPanel.kind === 'add';
    const currentProjectRemoveUser =
        props.openPanel?.projectId === props.project.id && props.openPanel.kind === 'remove';
    const currentProjectIsEdit =
        props.openPanel?.projectId === props.project.id && props.openPanel.kind === 'edit';

    const toggleMenu = (propsMenu: { projectId: string; kind: 'edit' | 'add' | 'remove' }) => {
        return props.openPanel?.kind === propsMenu.kind &&
            props.openPanel.projectId === propsMenu.projectId
            ? props.setOpenPanel(null)
            : props.setOpenPanel(propsMenu);
    };

    return (
        <div>
            <AlertDialog>
                <ButtonGroup className="p-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <div aria-label="More Options">
                                    <EllipsisVertical />
                                </div>
                            }
                        />
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    onClick={() => {
                                        if (props.otherUsers.length === 0) {
                                            toast.add({
                                                type: 'info',
                                                description:
                                                    'All available users have already been added.',
                                            });
                                            return;
                                        }
                                        toggleMenu({
                                            projectId: props.project.id,
                                            kind: 'add',
                                        });
                                    }}
                                >
                                    <UserPlus />
                                    Add to project
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        toggleMenu({
                                            projectId: props.project.id,
                                            kind: 'remove',
                                        });
                                    }}
                                >
                                    <UserMinus />
                                    Delete into project
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        toggleMenu({
                                            projectId: props.project.id,
                                            kind: 'edit',
                                        });
                                    }}
                                >
                                    <Pencil />
                                    Rename
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <AlertDialogTrigger
                                    nativeButton={false}
                                    render={
                                        <DropdownMenuItem variant="destructive">
                                            <Trash2Icon />
                                            Trash
                                        </DropdownMenuItem>
                                    }
                                />
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </ButtonGroup>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you sure you want to delete the project {props.project.title}?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete project and
                            tasks this project.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => props.handleDeleteProject(props.project.id)}
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <ProjectMembers
                project={props.project}
                users={props.otherUsers}
                openPanel={props.openPanel}
                onSelect={(userId) => props.addMember(userId)}
                isOpen={currentProjectAddUser}
                setIsOpen={(nextOpen) => {
                    if (!nextOpen) {
                        props.setOpenPanel(null);
                    }
                }}
            />
            <ProjectMembers
                project={props.project}
                users={props.projectUsers.filter((user) => {
                    return user.id !== props.project.owner_id;
                })}
                openPanel={props.openPanel}
                onSelect={(userId) => props.removeMember(userId)}
                isOpen={currentProjectRemoveUser}
                setIsOpen={(nextOpen) => {
                    if (!nextOpen) {
                        props.setOpenPanel(null);
                    }
                }}
            />
            <RenameProject
                project={props.project}
                handleUpdateProject={props.handleUpdateProject}
                setOpenPanel={props.setOpenPanel}
                isOpen={currentProjectIsEdit}
                setIsOpen={(nextOpen) => {
                    if (!nextOpen) {
                        props.setOpenPanel(null);
                    }
                }}
            />
        </div>
    );
}
