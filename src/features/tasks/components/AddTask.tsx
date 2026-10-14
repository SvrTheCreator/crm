import { Controller, useForm } from 'react-hook-form';
import type { CreateTaskType } from '../types.ts';
import { getCurrentDate } from '@/shared/utils/getCurrentDate.ts';
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

type Props = {
    handleAddTask: (task: CreateTaskType) => void;
    currentProjectId: string;
    users: UsersType[];
    projectUsers: UsersType[];
    isAddItemOpen: boolean;
    setIsAddItemOpen: (isAddItemOpen: boolean) => void;
};

export function AddTask(props: Props) {
    const { register, handleSubmit, reset, control } = useForm<CreateTaskType>({
        defaultValues: {
            assignee: null,
            priority: 'Low',
            status: 'To Do',
        },
    });

    const handleCreateNewTask = (data: CreateTaskType) => {
        const task: CreateTaskType = {
            project_id: props.currentProjectId,
            title: data.title,
            description: data.description,
            assignee: data.assignee || null,
            priority: data.priority,
            due_date: data.due_date === '' ? null : data.due_date,
            status: data.status,
        };

        props.handleAddTask(task);

        console.log(task);
        reset();
    };

    const usersItems = props.projectUsers.map((user: UsersType) => {
        const fullName = `${user.first_name} ${user.last_name}`;

        return { label: fullName, value: user.id };
    });

    return (
        <Dialog open={props.isAddItemOpen} onOpenChange={props.setIsAddItemOpen}>
            <form onSubmit={handleSubmit(handleCreateNewTask)}>
                <DialogContent>
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
                            <Input
                                {...register('description', { required: true })}
                                placeholder="Description"
                            />
                        </Field>
                        <Field>
                            <Controller
                                control={control}
                                name="assignee"
                                rules={{
                                    required: true,
                                }}
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
                        <Field>
                            <div>
                                <label htmlFor="dueDate">dueDate</label>
                                <input
                                    min={getCurrentDate()}
                                    type="date"
                                    {...register('due_date')}
                                />
                            </div>
                        </Field>
                    </FieldGroup>
                    {/*<div>*/}
                    {/*    <label htmlFor="priority">priority</label>*/}
                    {/*    <select {...register('priority', { required: true })}>*/}
                    {/*        <option value="">Select...</option>*/}
                    {/*        <option value="Low">Low</option>*/}
                    {/*        <option value="Medium">Medium</option>*/}
                    {/*        <option value="High">High</option>*/}
                    {/*    </select>*/}
                    {/*</div>*/}
                    {/*<div>*/}
                    {/*    <label htmlFor="dueDate">dueDate</label>*/}
                    {/*    <input min={getCurrentDate()} type="date" {...register('due_date')} />*/}
                    {/*</div>*/}
                    {/*<div>*/}
                    {/*    <label htmlFor="status">status</label>*/}
                    {/*    <select {...register('status', { required: true })}>*/}
                    {/*        <option value="">Select...</option>*/}
                    {/*        <option value="To Do">To Do</option>*/}
                    {/*        <option value="Done">Done</option>*/}
                    {/*        <option value="In progress">In progress</option>*/}
                    {/*    </select>*/}
                    {/*</div>*/}
                    <DialogFooter>
                        <DialogClose
                            render={<Button variant="outline">Cancel</Button>}
                        ></DialogClose>
                        <Button className="cursor-pointer" variant="default" type="submit">
                            Add New Task
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}
