import { Controller, useForm } from 'react-hook-form';
import type { CreateTaskType, TaskFormValues } from '../types.ts';
import type { UsersType } from '../../users/types.ts';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Field, FieldGroup } from '@/components/ui/field.tsx';
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
import { cn } from '@/lib/utils.ts';
import { priorityColor, statusColor } from '@/shared/constants.ts';
import { StatusBadge } from '@/shared/components/StatusBadge.tsx';
import type { Priority, Status } from '@/shared/types.ts';
import { PriorityBadge } from '@/shared/components/PriorityBadge.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { ChevronDownIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar.tsx';
import { format } from 'date-fns';
import { toast } from '@/components/ui/toast.tsx';

type Props = {
    handleAddTask: (task: CreateTaskType) => void;
    currentProjectId: string;
    users: UsersType[];
    projectUsers: UsersType[];
    isAddItemOpen: boolean;
    setIsAddItemOpen: (isAddItemOpen: boolean) => void;
};

export function AddTask(props: Props) {
    const { register, handleSubmit, reset, control } = useForm<TaskFormValues>({
        defaultValues: {
            assignee: null,
            priority: 'Low',
            status: 'To Do',
        },
    });

    const handleCreateNewTask = (data: TaskFormValues) => {
        const task: CreateTaskType = {
            project_id: props.currentProjectId,
            title: data.title,
            description: data.description || null,
            assignee: data.assignee || null,
            priority: data.priority,
            due_date: data.due_date ? format(data.due_date, 'yyyy-MM-dd') : null,
            status: data.status,
        };

        props.handleAddTask(task);
        toast.add({
            type: 'info',
            description: `Task '${data.title}' added successfully.`,
        });
        reset();
        props.setIsAddItemOpen(false);
    };

    const usersItems = props.projectUsers.map((user: UsersType) => {
        const fullName = `${user.first_name} ${user.last_name}`;

        return { label: fullName, value: user.id };
    });

    return (
        <Dialog open={props.isAddItemOpen} onOpenChange={props.setIsAddItemOpen}>
            <DialogContent>
                <form onSubmit={handleSubmit(handleCreateNewTask)} className="grid gap-6">
                    <DialogHeader>
                        <DialogTitle>Add Task</DialogTitle>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Input
                                {...register('title', { required: true })}
                                placeholder="Task Name"
                            />
                        </Field>
                        <Field>
                            <Input {...register('description')} placeholder="Description" />
                        </Field>
                        <Field>
                            <Controller
                                control={control}
                                name="assignee"
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        items={usersItems}
                                    >
                                        <SelectTrigger className="w-full max-w-100">
                                            <SelectValue placeholder="Assignee" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Assignee</SelectLabel>
                                                <SelectItem value="">Select a assignee</SelectItem>
                                                {usersItems.map((item) => (
                                                    <SelectItem key={item.value} value={item.value}>
                                                        {item.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </Field>
                        <Field>
                            <Controller
                                control={control}
                                name="priority"
                                rules={{
                                    required: true,
                                }}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
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
                                                {Object.entries(priorityColor).map(
                                                    ([value, color]) => (
                                                        <SelectItem key={value} value={value}>
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
                            <Controller
                                control={control}
                                name="status"
                                rules={{
                                    required: true,
                                }}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
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
                                                {Object.entries(statusColor).map(
                                                    ([value, { Icon, color }]) => (
                                                        <SelectItem key={value} value={value}>
                                                            <span>
                                                                <Icon
                                                                    className={cn('size-4', color)}
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
                        <Controller
                            control={control}
                            name="due_date"
                            render={({ field }) => {
                                console.log(field);

                                return (
                                    <Popover>
                                        <PopoverTrigger
                                            render={
                                                <Button
                                                    variant={'outline'}
                                                    data-empty={!field.value}
                                                    className="w-40 justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                                                >
                                                    {field.value ? (
                                                        format(field.value, 'PPP')
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
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                defaultMonth={field.value}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                );
                            }}
                        />
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose
                            render={<Button variant="outline">Cancel</Button>}
                        ></DialogClose>
                        <Button className="cursor-pointer" variant="default" type="submit">
                            Add New Task
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
