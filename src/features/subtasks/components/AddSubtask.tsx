import type { CreateSubtaskType, SubtaskFormValues } from '../types.ts';
import { Controller, useForm } from 'react-hook-form';
import type { UsersType } from '../../users/types.ts';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog.tsx';
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
        <Dialog open={props.isAddItemOpen} onOpenChange={props.setIsAddItemOpen}>
            <DialogContent>
                <form onSubmit={handleSubmit(handleCreateSubtask)} className="grid gap-6">
                    <DialogHeader>
                        <DialogTitle>Add Subask</DialogTitle>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Input
                                {...register('title', { required: true })}
                                placeholder="Subtask Name"
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
                                                <SelectItem value="">Unassigned</SelectItem>
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
                            Add New Subtask
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
        // <form onSubmit={handleSubmit(handleCreateSubtask)}>
        //     <div>
        //         <label htmlFor="title">Subtask Name</label>
        //         <input {...register('title', { required: true })} id="title" type="text" />
        //     </div>
        //     <div>
        //         <label htmlFor="description">Description</label>
        //         <input {...register('description')} id="description" type="text" />
        //     </div>
        //     <div>
        //         <label htmlFor="assignee">assignee</label>
        //         <select {...register('assignee')} name="assignee">
        //             <option value="">Не выбран</option>
        //             {props.users.map((user: UsersType) => {
        //                 const fullName = `${user.first_name} ${user.last_name}`;
        //                 return (
        //                     <option key={user.id} value={user.id}>
        //                         {fullName}
        //                     </option>
        //                 );
        //             })}
        //         </select>
        //     </div>
        //     <div>
        //         <select {...register('priority', { required: true })}>
        //             <option value="">Select priority...</option>
        //             <option value="Medium">Medium</option>
        //             <option value="High">High</option>
        //             <option value="Low">Low</option>
        //         </select>
        //     </div>
        //     <div>
        //         <label htmlFor="due_date">Due date</label>
        //         <input min={getCurrentDate()} {...register('due_date')} type="date" />
        //     </div>
        //     <div>
        //         <label htmlFor="status">status</label>
        //         <select {...register('status', { required: true })}>
        //             <option value="">Select status...</option>
        //             <option value="To Do">To Do</option>
        //             <option value="Done">Done</option>
        //             <option value="In progress">In progress</option>
        //         </select>
        //     </div>
        //     <button type="submit">Create</button>
        // </form>
    );
}
