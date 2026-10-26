import { AssigneeValue } from '@/shared/components/AssigneeValue.tsx';
import type { CreateSubtaskType, SubtaskFormValues } from '../types.ts';
import { Controller, useForm } from 'react-hook-form';
import type { UsersType } from '../../users/types.ts';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field.tsx';
import { Input } from '@/components/ui/input.tsx';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select.tsx';
import type { Priority, Status } from '@/shared/types.ts';
import { PriorityBadge } from '@/shared/components/PriorityBadge.tsx';
import { priorityColor, statusColor } from '@/shared/constants.ts';
import { cn } from '@/lib/utils.ts';
import { StatusBadge } from '@/shared/components/StatusBadge.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { Button } from '@/components/ui/button.tsx';
import { format } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar.tsx';
import { Card, CardContent, CardFooter } from '@/components/ui/card.tsx';

type Props = {
    handleAddSubtask: (newSubtask: CreateSubtaskType) => void;
    taskId: string;
    users: UsersType[];
    projectUsers: UsersType[];
    isAddItemOpen: boolean;
    setIsAddItemOpen: (isAddItemOpen: boolean) => void;
};

export function AddSubtask(props: Props) {
    const { register, handleSubmit, reset, control } = useForm<SubtaskFormValues>({
        defaultValues: {
            assignee: null,
            priority: 'Low',
            status: 'To Do',
        },
    });

    const handleCreateSubtask = (newSubtask: SubtaskFormValues) => {
        const subtask: CreateSubtaskType = {
            task_id: props.taskId,
            title: newSubtask.title,
            description: newSubtask.description || null,
            assignee: newSubtask.assignee || null,
            priority: newSubtask.priority,
            due_date: newSubtask.due_date ? format(newSubtask.due_date, 'yyyy-MM-dd') : null,
            status: newSubtask.status,
        };

        props.handleAddSubtask(subtask);
        reset();
        props.setIsAddItemOpen(false);
    };

    const usersItems = props.projectUsers.map((user: UsersType) => {
        const fullName = `${user.first_name} ${user.last_name}`;

        return { label: fullName, value: user.id };
    });

    return (
        props.isAddItemOpen && (
            <Card>
                <CardContent>
                    <form onSubmit={handleSubmit(handleCreateSubtask)} className="grid gap-6">
                        <FieldGroup>
                            <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                                <Field>
                                    <FieldLabel className="text-xs text-muted-foreground">
                                        Subtask name
                                    </FieldLabel>
                                    <Input
                                        {...register('title', { required: true })}
                                        placeholder="Subtask Name"
                                        required
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel className="text-xs text-muted-foreground">
                                        Description
                                    </FieldLabel>
                                    <Input {...register('description')} placeholder="Description" />
                                </Field>
                                <Field>
                                    <FieldLabel className="text-xs text-muted-foreground">
                                        Assignee
                                    </FieldLabel>
                                    <Controller
                                        control={control}
                                        name="assignee"
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                items={usersItems}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Assignee">
                                                        {(value: string | null) => (
                                                            <AssigneeValue
                                                                user={props.projectUsers.find(
                                                                    (item) => item.id === value,
                                                                )}
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
                                                        {props.projectUsers.map((user) => (
                                                            <SelectItem
                                                                key={user.id}
                                                                value={user.id}
                                                            >
                                                                <AssigneeValue user={user} />
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel className="text-xs text-muted-foreground">
                                        Priority
                                    </FieldLabel>
                                    <Controller
                                        control={control}
                                        name="priority"
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger>
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
                                                        {Object.entries(priorityColor).map(
                                                            ([value, color]) => (
                                                                <SelectItem
                                                                    key={value}
                                                                    value={value}
                                                                >
                                                                    <span
                                                                        className={cn(
                                                                            'size-2 rounded-full',
                                                                            color,
                                                                        )}
                                                                    />
                                                                    {value}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel className="text-xs text-muted-foreground">
                                        Status
                                    </FieldLabel>
                                    <Controller
                                        control={control}
                                        name="status"
                                        rules={{
                                            required: true,
                                        }}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger>
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
                                                        {Object.entries(statusColor).map(
                                                            ([value, { Icon, color }]) => (
                                                                <SelectItem
                                                                    key={value}
                                                                    value={value}
                                                                >
                                                                    <span>
                                                                        <Icon
                                                                            className={cn(
                                                                                'size-4',
                                                                                color,
                                                                            )}
                                                                        />
                                                                    </span>
                                                                    {value}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel className="text-xs text-muted-foreground">
                                        Due date
                                    </FieldLabel>
                                    <Controller
                                        control={control}
                                        name="due_date"
                                        render={({ field }) => {
                                            return (
                                                <Popover>
                                                    <PopoverTrigger
                                                        render={
                                                            <Button
                                                                variant={'outline'}
                                                                data-empty={!field.value}
                                                                className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground bg-input/30"
                                                            >
                                                                <span className="truncate">
                                                                    {field.value
                                                                        ? format(field.value, 'PP')
                                                                        : 'Pick a date'}
                                                                </span>
                                                                <ChevronDownIcon
                                                                    data-icon="inline-end"
                                                                    className="shrink-0"
                                                                />
                                                            </Button>
                                                        }
                                                    />
                                                    <PopoverContent
                                                        className="w-auto p-0"
                                                        align="start"
                                                    >
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            defaultMonth={field.value}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            );
                                        }}
                                    />
                                </Field>
                            </div>
                        </FieldGroup>
                        <CardFooter className="flex gap-4 justify-end p-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => props.setIsAddItemOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button className="cursor-pointer" variant="default" type="submit">
                                Add New Subtask
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        )
    );
}
