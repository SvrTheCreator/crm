import type { TaskType } from '../types.ts';
import { Fragment, useState } from 'react';
import { SubtasksList } from '../../subtasks/components/SubtasksList.tsx';
import { getCurrentDate } from '@/shared/utils/getCurrentDate.ts';
import type { UsersType } from '../../users/types.ts';
import { TableCell, TableRow } from '@/components/ui/table.tsx';
import type { Priority, Status, UpdateField, UpdateValue } from '@/shared/types.ts';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { SidebarMenuAction } from '@/components/ui/sidebar.tsx';
import { EllipsisVertical, Pencil, Trash2Icon } from 'lucide-react';

type Props = {
    task: TaskType;
    users: UsersType[];
    projectUsers: UsersType[];
    handleUpdateTask: (id: string, field: UpdateField, value: UpdateValue) => void;
    setOpenDialog: (value: { kind: 'delete' | 'edit'; task: TaskType } | null) => void;
};

export function Task(props: Props) {
    const [openTaskId, setOpenTaskId] = useState<string | null>(null);

    const handleCurrentTask = (taskId: string) => {
        return openTaskId === taskId ? setOpenTaskId(null) : setOpenTaskId(taskId);
    };

    const currentUser = props.users.find((user) => user.id === props.task.assignee);

    return (
        <Fragment>
            <TableRow style={{ position: 'relative' }}>
                <TableCell>
                    <button
                        onClick={() => handleCurrentTask(props.task.id)}
                        style={{ textDecoration: 'underline', cursor: 'pointer' }}
                    >
                        {props.task.title}
                    </button>
                    {/*)}*/}
                </TableCell>
                <TableCell className="truncate max-w-50">
                    {props.task.description ? props.task.description : 'Add a description'}
                </TableCell>
                <TableCell>
                    <select
                        onChange={(event) => {
                            props.handleUpdateTask(
                                props.task.id,
                                'assignee',
                                event.target.value === '' ? null : event.target.value,
                            );
                        }}
                        defaultValue={currentUser ? currentUser.id : ''}
                    >
                        <option value="">Не выбран</option>
                        {props.projectUsers.map((item: UsersType) => {
                            return (
                                <option key={item.id} value={item.id}>
                                    {`${item.first_name} ${item.last_name}`}
                                </option>
                            );
                        })}
                    </select>
                </TableCell>
                <TableCell>
                    <select
                        defaultValue={props.task.priority}
                        onChange={(event) =>
                            props.handleUpdateTask(
                                props.task.id,
                                'priority',
                                event.target.value as Priority,
                            )
                        }
                    >
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Low">Low</option>
                    </select>
                </TableCell>
                <TableCell>
                    <input
                        min={getCurrentDate()}
                        type="date"
                        defaultValue={props.task.due_date === null ? '' : props.task.due_date}
                        onChange={(event) => {
                            props.handleUpdateTask(
                                props.task.id,
                                'due_date',
                                event.target.value === '' ? null : event.target.value,
                            );
                        }}
                    />
                </TableCell>
                <TableCell>
                    <select
                        defaultValue={props.task.status}
                        onChange={(event) =>
                            props.handleUpdateTask(
                                props.task.id,
                                'status',
                                event.target.value as Status,
                            )
                        }
                    >
                        <option value="To Do">To Do</option>
                        <option value="Done">Done</option>
                        <option value="In progress">In progress</option>
                    </select>
                </TableCell>
                <TableCell className="flex justify-start items-start">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <SidebarMenuAction
                                    className="relative right-0 top-0"
                                    aria-label="More Options"
                                >
                                    <EllipsisVertical />
                                </SidebarMenuAction>
                            }
                        />
                        <DropdownMenuContent>
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    onClick={() => {
                                        props.setOpenDialog({ kind: 'edit', task: props.task });
                                    }}
                                >
                                    <Pencil />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() =>
                                        props.setOpenDialog({ kind: 'delete', task: props.task })
                                    }
                                    variant="destructive"
                                >
                                    <Trash2Icon />
                                    Trash
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>

            {openTaskId === props.task.id && (
                <tr>
                    <td colSpan={7}>
                        <SubtasksList users={props.users} taskId={props.task.id} />
                    </td>
                </tr>
            )}
        </Fragment>
    );
}
