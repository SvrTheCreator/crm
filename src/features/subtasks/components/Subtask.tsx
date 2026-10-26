import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { AssigneeValue } from '@/shared/components/AssigneeValue.tsx';
import type { SubtaskType } from '../types.ts';
import { Fragment } from 'react';
import type { UsersType } from '../../users/types.ts';
import type { Priority, Status, UpdateField, UpdateValue } from '@/shared/types.ts';
import { TableCell, TableRow } from '@/components/ui/table.tsx';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { Button } from '@/components/ui/button.tsx';
import { format } from 'date-fns';
import { ChevronDownIcon, EllipsisVertical, Pencil, Trash2Icon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar.tsx';
import { StatusBadge } from '@/shared/components/StatusBadge.tsx';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { SidebarMenuAction } from '@/components/ui/sidebar.tsx';

type Props = {
    subtask: SubtaskType;
    users: UsersType[];
    projectUsers: UsersType[];
    handleUpdateSubtask: (id: string, field: UpdateField, value: UpdateValue) => void;
    setOpenDialog: (value: { kind: 'delete' | 'edit'; subtask: SubtaskType } | null) => void;
};

export function Subtask(props: Props) {
    const dueDate = props.subtask.due_date ? new Date(props.subtask.due_date) : undefined;

    const usersItems = props.users.map((user: UsersType) => {
        const fullName = `${user.first_name} ${user.last_name}`;

        return { label: fullName, value: user.id };
    });

    return (
        <Fragment>
            <TableRow>
                <TableCell>
                    <Tooltip>
                        <TooltipTrigger render={<span className="block truncate" />}>
                            {props.subtask.title}
                        </TooltipTrigger>
                        <TooltipContent>{props.subtask.title}</TooltipContent>
                    </Tooltip>
                </TableCell>
                <TableCell>
                    {props.subtask.description ? (
                        <Tooltip>
                            <TooltipTrigger render={<p className="truncate" />}>
                                {props.subtask.description}
                            </TooltipTrigger>
                            <TooltipContent>{props.subtask.description}</TooltipContent>
                        </Tooltip>
                    ) : (
                        <p className="truncate text-muted-foreground">Add a description</p>
                    )}
                </TableCell>
                <TableCell>
                    <Select
                        value={props.subtask.assignee ?? ''}
                        onValueChange={(value) =>
                            props.handleUpdateSubtask(props.subtask.id, 'assignee', value || null)
                        }
                        items={usersItems}
                    >
                        <SelectTrigger className="w-full max-w-100">
                            <SelectValue placeholder="Assignee">
                                {(value: string | null) => (
                                    <AssigneeValue
                                        compact
                                        user={props.users.find((item) => item.id === value)}
                                    />
                                )}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="w-auto min-w-(--anchor-width)">
                            <SelectGroup>
                                <SelectLabel>Assignee</SelectLabel>
                                <SelectItem value="">
                                    <AssigneeValue />
                                </SelectItem>
                                {props.projectUsers.map((item: UsersType) => (
                                    <SelectItem key={item.id} value={item.id}>
                                        <AssigneeValue user={item} />
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </TableCell>
                <TableCell>
                    <Select
                        value={props.subtask.priority}
                        onValueChange={(event) =>
                            props.handleUpdateSubtask(
                                props.subtask.id,
                                'priority',
                                event as Priority,
                            )
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
                                    data-empty={!dueDate}
                                    className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground bg-input/30"
                                >
                                    <span className="truncate">
                                        {dueDate ? format(dueDate, 'PP') : 'Pick a date'}
                                    </span>
                                    <ChevronDownIcon data-icon="inline-end" className="shrink-0" />
                                </Button>
                            }
                        />
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={dueDate}
                                onSelect={(date) =>
                                    props.handleUpdateSubtask(
                                        props.subtask.id,
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
                        value={props.subtask.status}
                        onValueChange={(event) =>
                            props.handleUpdateSubtask(props.subtask.id, 'status', event as Status)
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
                                        props.setOpenDialog({
                                            kind: 'edit',
                                            subtask: props.subtask,
                                        });
                                    }}
                                >
                                    <Pencil />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() =>
                                        props.setOpenDialog({
                                            kind: 'delete',
                                            subtask: props.subtask,
                                        })
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
        </Fragment>
    );
}
