import type { ProjectType } from '../types.ts';

import type { UsersType } from '../../users/types.ts';
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
} from '@/components/ui/alert-dialog.tsx';
import { RenameProject } from '@/features/projects/components/RenameProject.tsx';
import { toast } from '@/components/ui/toast';
import type { PostgrestError } from '@supabase/supabase-js';
import { SidebarMenuAction } from '@/components/ui/sidebar.tsx';
import type { UpdateField, UpdateValue } from '@/shared/types.ts';

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

export type OpenPanelKind = 'edit' | 'add' | 'remove' | 'delete';

export type OpenPanelType = {
    projectId: string;
    kind: OpenPanelKind;
} | null;

export function Project(props: Props) {
    const currentProjectAddUser =
        props.openPanel?.projectId === props.project.id && props.openPanel.kind === 'add';
    const currentProjectRemoveUser =
        props.openPanel?.projectId === props.project.id && props.openPanel.kind === 'remove';
    const currentProjectIsEdit =
        props.openPanel?.projectId === props.project.id && props.openPanel.kind === 'edit';
    const currentProjectIsDelete =
        props.openPanel?.projectId === props.project.id && props.openPanel.kind === 'delete';

    const removableUsers = props.projectUsers.filter((user) => user.id !== props.project.owner_id);

    const toggleMenu = (propsMenu: { projectId: string; kind: OpenPanelKind }) => {
        return props.openPanel?.kind === propsMenu.kind &&
            props.openPanel.projectId === propsMenu.projectId
            ? props.setOpenPanel(null)
            : props.setOpenPanel(propsMenu);
    };

    return (
        <div>
            <AlertDialog
                open={currentProjectIsDelete}
                onOpenChange={() => props.setOpenPanel(null)}
            >
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <SidebarMenuAction aria-label="More Options">
                                <EllipsisVertical />
                            </SidebarMenuAction>
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
                                    if (removableUsers.length === 0) {
                                        toast.add({
                                            type: 'info',
                                            description:
                                                'There is no one to remove, you are the only member.',
                                        });
                                        return;
                                    }
                                    toggleMenu({
                                        projectId: props.project.id,
                                        kind: 'remove',
                                    });
                                }}
                            >
                                <UserMinus />
                                Remove from project
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
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() => {
                                    toggleMenu({
                                        projectId: props.project.id,
                                        kind: 'delete',
                                    });
                                }}
                            >
                                <Trash2Icon />
                                Trash
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
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
                users={removableUsers}
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
