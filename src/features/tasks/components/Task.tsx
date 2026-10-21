import type { TaskType } from '../types.ts';
import { Fragment, useState } from 'react';
import { SubtasksList } from '../../subtasks/components/SubtasksList.tsx';
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
import { ChevronDownIcon, EllipsisVertical, Pencil, Trash2Icon } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select.tsx';
import { PriorityBadge } from '@/shared/components/PriorityBadge.tsx';
import { priorityColor, statusColor } from '@/shared/constants.ts';
import { cn } from '@/lib/utils.ts';
import { StatusBadge } from '@/shared/components/StatusBadge.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { Button } from '@/components/ui/button.tsx';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar.tsx';

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

    const dueDate = props.task.due_date ? new Date(props.task.due_date) : undefined;

    const usersItems = props.users.map((user: UsersType) => {
        const fullName = `${user.first_name} ${user.last_name}`;

        return { label: fullName, value: user.id };
    });

    return (
        <Fragment>
            <TableRow style={{ position: 'relative' }}>
                <TableCell
                    className="cursor-pointer"
                    onClick={() => handleCurrentTask(props.task.id)}
                >
                    <Button variant="link">{props.task.title}</Button>
                </TableCell>
                <TableCell className="truncate max-w-50">
                    {props.task.description ? (
                        <p>props.task.description</p>
                    ) : (
                        <p className="text-muted-foreground">Add a description</p>
                    )}
                </TableCell>
                <TableCell>
                    <Select
                        value={props.task.assignee ?? ''}
                        onValueChange={(value) =>
                            props.handleUpdateTask(props.task.id, 'assignee', value || null)
                        }
                        items={usersItems}
                    >
                        <SelectTrigger className="w-full max-w-100">
                            <SelectValue placeholder="Assignee" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Assignee</SelectLabel>
                                <SelectItem className="text-muted-foreground" value="">
                                    Unassigned
                                </SelectItem>
                                {props.projectUsers.map((item: UsersType) => {
                                    return (
                                        <SelectItem key={item.id} value={item.id}>
                                            {`${item.first_name} ${item.last_name}`}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </TableCell>
                <TableCell>
                    <Select
                        value={props.task.priority}
                        onValueChange={(event) =>
                            props.handleUpdateTask(props.task.id, 'priority', event as Priority)
                        }
                    >
                        <SelectTrigger className="w-full max-w-100">
                            <SelectValue placeholder="Priority">
                                {(value: Priority | null) => {
                                    if (!value) return null;
                                    return <PriorityBadge value={value} />;
                                }}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel> Priority</SelectLabel>
                                {Object.entries(priorityColor).map(([value, color]) => (
                                    <SelectItem key={value} value={value}>
                                        <span className={cn('size-2 rounded-full', color)} />
                                        {value}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </TableCell>
                <TableCell>
                    <Popover>
                        <PopoverTrigger
                            render={
                                <Button
                                    variant="outline"
                                    data-empty={dueDate}
                                    className="w-45 justify-between text-left font-normal data-[empty=true]:text-muted-foreground bg-input/30"
                                >
                                    {dueDate ? format(dueDate, 'PPP') : <span>Pick a date</span>}
                                    <ChevronDownIcon data-icon="inline-end" />
                                </Button>
                            }
                        />
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={dueDate}
                                onSelect={(date) =>
                                    props.handleUpdateTask(
                                        props.task.id,
                                        'due_date',
                                        date ? format(date, 'yyyy-MM-dd') : null,
                                    )
                                }
                            />
                        </PopoverContent>
                    </Popover>
                </TableCell>
                <TableCell>
                    <Select
                        value={props.task.status}
                        onValueChange={(event) =>
                            props.handleUpdateTask(props.task.id, 'status', event as Status)
                        }
                    >
                        <SelectTrigger className="w-full max-w-100">
                            <SelectValue placeholder="Status">
                                {(value: Status | null) => {
                                    if (!value) return null;
                                    return <StatusBadge value={value} />;
                                }}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel> Priority</SelectLabel>
                                {Object.entries(statusColor).map(([value, { Icon, color }]) => (
                                    <SelectItem key={value} value={value}>
                                        <span>
                                            <Icon className={cn('size-4', color)} />
                                        </span>
                                        {value}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </TableCell>
                <TableCell>
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
