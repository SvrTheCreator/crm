import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog.tsx';
import { useNavigate, useOutletContext, useParams } from 'react-router';
import { SubtasksList } from '@/features/subtasks/components/SubtasksList.tsx';
import { useUsers } from '@/features/users/hooks/useUsers.ts';
import type { UsersType } from '@/features/users/types.ts';
import type { TaskType } from '@/features/tasks/types.ts';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select.tsx';
import type { Priority, Status, UpdateField, UpdateValue } from '@/shared/types.ts';
import { PriorityBadge } from '@/shared/components/PriorityBadge.tsx';
import { priorityColor, statusColor } from '@/shared/constants.ts';
import { cn } from '@/lib/utils.ts';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { Button } from '@/components/ui/button.tsx';
import { format } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar.tsx';
import { StatusBadge } from '@/shared/components/StatusBadge.tsx';

export function SubtasksDialog() {
    const navigate = useNavigate();
    const { itemsList, projectUsers, handleUpdateItem } = useOutletContext<{
        itemsList: TaskType[];
        projectUsers: UsersType[];
        handleUpdateItem: (taskId: string, field: UpdateField, value: UpdateValue) => void;
    }>();
    const { taskId } = useParams();
    const { users } = useUsers();

    const currentTask = itemsList.find((task) => task.id === taskId);

    if (!taskId || !currentTask) return null;

    const dueDate = currentTask.due_date ? new Date(currentTask.due_date) : undefined;

    const usersItems = users.map((user: UsersType) => {
        const fullName = `${user.first_name} ${user.last_name}`;

        return { label: fullName, value: user.id };
    });

    return (
        <Dialog open onOpenChange={() => navigate('..')}>
            <DialogContent className="sm:max-w-5xl max-h-[85vh] overflow-y-auto overflow-x-hidden">
                <DialogHeader>
                    <DialogTitle>Task: '{currentTask?.title}'</DialogTitle>
                    <DialogDescription>
                        Description:{' '}
                        {currentTask?.description ? currentTask.description : 'Add a description'}
                    </DialogDescription>
                    <div className="flex gap-5">
                        <Select
                            value={currentTask.assignee ?? ''}
                            onValueChange={(value) =>
                                handleUpdateItem(currentTask.id, 'assignee', value || null)
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
                                    {projectUsers.map((item: UsersType) => {
                                        return (
                                            <SelectItem key={item.id} value={item.id}>
                                                {`${item.first_name} ${item.last_name}`}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Select
                            value={currentTask.priority}
                            onValueChange={(event) =>
                                handleUpdateItem(currentTask.id, 'priority', event as Priority)
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
                    </div>
                    <div className="flex gap-5">
                        <Popover>
                            <PopoverTrigger
                                render={
                                    <Button
                                        variant="outline"
                                        data-empty={dueDate}
                                        className="w-45 justify-between text-left font-normal data-[empty=true]:text-muted-foreground bg-input/30"
                                    >
                                        {dueDate ? (
                                            format(dueDate, 'PPP')
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <ChevronDownIcon data-icon="inline-end" />
                                    </Button>
                                }
                            />
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={dueDate}
                                    onSelect={(date) =>
                                        handleUpdateItem(
                                            currentTask.id,
                                            'due_date',
                                            date ? format(date, 'yyyy-MM-dd') : null,
                                        )
                                    }
                                />
                            </PopoverContent>
                        </Popover>
                        <Select
                            value={currentTask.status}
                            onValueChange={(event) =>
                                handleUpdateItem(currentTask.id, 'status', event as Status)
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
                    </div>
                </DialogHeader>
                <SubtasksList taskId={taskId} users={users} projectUsers={projectUsers} />
            </DialogContent>
        </Dialog>
    );
}
