import { type CreateTaskType, type EditedFieldType, type TaskType } from '../types.ts';
import { useState } from 'react';
import { AddTask } from './AddTask.tsx';
import { Task } from './Task.tsx';
import { createTask, readTasks, deleteTask, updateTask } from '../api.ts';
import { useUsers } from '../../users/hooks/useUsers.ts';
import { useCrud } from '@/shared/hooks/useCollection.ts';
import { Outlet, useOutletContext, useParams } from 'react-router';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty.tsx';
import { ArrowUpRight, ListTodo } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner.tsx';
import type { ContextType } from '@/pages/workspace/Workspace.tsx';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx';
import { Button } from '@/components/ui/button.tsx';
import type { SortField } from '@/shared/types.ts';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog.tsx';
import { Field, FieldGroup } from '@/components/ui/field.tsx';
import { Input } from '@/components/ui/input.tsx';
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
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea.tsx';

interface SortConfig {
    field: SortField | null;
    order: boolean | null;
}

export function TaskList() {
    const params = useParams();
    const {
        itemsList,
        loading,
        error,
        isAddItemOpen,
        setIsAddItemOpen,
        handleCreateItem,
        handleRemoveItem,
        handleUpdateItem,
        handleUpdateFields,
    } = useCrud<TaskType, string | null, CreateTaskType>({
        itemName: 'Task',
        readItems: readTasks,
        required_ID: params.projectId ?? null,
        createItem: createTask,
        deleteItem: deleteTask,
        updateItem: updateTask,
    });

    const [openDialog, setOpenDialog] = useState<{
        kind: 'delete' | 'edit';
        task: TaskType;
    } | null>(null);

    const { register, handleSubmit } = useForm<EditedFieldType>({
        values: {
            title: openDialog?.task.title ?? '',
            description: openDialog?.task.description ?? '',
        },
    });

    const handleEditTask = (data: EditedFieldType) => {
        if (openDialog === null) return;

        const description = data.description || null;
        const changes: Partial<TaskType> = {};
        if (openDialog.task.title !== data.title) {
            changes.title = data.title;
        }
        if (openDialog.task.description !== description) {
            changes.description = description;
        }

        handleUpdateFields(openDialog.task.id, changes);
        setOpenDialog(null);
    };

    const { projectUsers } = useOutletContext<ContextType>();
    const { users, loading: usersLoading } = useUsers();

    const [sortConfig, setSortConfig] = useState<SortConfig>({
        field: null,
        order: null,
    });

    const handleRemoveTask = () => {
        if (openDialog === null) return;
        handleRemoveItem(openDialog?.task?.id);
        setOpenDialog(null);
    };

    const handleConfig = (arg: SortField) => {
        setSortConfig((prev) => ({
            ...prev,
            field: arg,
            order: !prev.order,
        }));
    };

    const sortedTaskList = [...itemsList].sort((a, b) => {
        if (!sortConfig.field) return 0;

        const aValue = a[sortConfig.field];
        const bValue = b[sortConfig.field];

        return sortConfig.order
            ? aValue.toString().localeCompare(bValue.toString(), undefined, {
                  numeric: true,
                  sensitivity: 'base',
              })
            : bValue.toString().localeCompare(aValue.toString(), undefined, {
                  numeric: true,
                  sensitivity: 'base',
              });
    });

    return (
        <div style={{ padding: '24px' }}>
            {params.projectId === null ? (
                'Choose a project'
            ) : error !== '' ? (
                error
            ) : loading || usersLoading ? (
                <div className="flex justify-center py-20">
                    <Spinner className="size-8 text-muted-foreground" />
                </div>
            ) : (
                <div>
                    <div className="flex justify-end items-center mb-5 ">
                        <Button
                            type="button"
                            size="lg"
                            className="cursor-pointer"
                            onClick={() => setIsAddItemOpen(!isAddItemOpen)}
                        >
                            Add task
                        </Button>
                    </div>
                    {isAddItemOpen && params.projectId && (
                        <AddTask
                            currentProjectId={params.projectId}
                            handleAddTask={handleCreateItem}
                            users={users}
                            projectUsers={projectUsers}
                            isAddItemOpen={isAddItemOpen}
                            setIsAddItemOpen={setIsAddItemOpen}
                        />
                    )}
                    {!itemsList.length && (
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <ListTodo />
                                </EmptyMedia>
                                <EmptyTitle>No tasks yet</EmptyTitle>
                                <EmptyDescription className="flex items-center gap-1">
                                    Create the first one with
                                    <span className="text-foreground">Add task</span>
                                    <ArrowUpRight className="size-4" />
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    )}
                    {itemsList.length > 0 && (
                        <>
                            <Table className="table-fixed ">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead
                                            className="cursor-pointer w-[20%]"
                                            onClick={() => {
                                                handleConfig('title');
                                            }}
                                        >
                                            Task Name
                                        </TableHead>
                                        <TableHead className="hidden w-[22%] 2xl:table-cell">
                                            Description
                                        </TableHead>
                                        <TableHead className="w-28">Assignee</TableHead>
                                        <TableHead
                                            className="cursor-pointer w-32"
                                            onClick={() => handleConfig('priority')}
                                        >
                                            Priority
                                        </TableHead>
                                        <TableHead className="w-36">Due Date</TableHead>
                                        <TableHead
                                            className="cursor-pointer w-44"
                                            onClick={() => handleConfig('status')}
                                        >
                                            Status
                                        </TableHead>
                                        <TableHead className="w-20">Subtasks</TableHead>
                                        <TableHead className="w-17">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedTaskList.map((task: TaskType) => (
                                        <Task
                                            setOpenDialog={setOpenDialog}
                                            key={task.id}
                                            users={users}
                                            task={task}
                                            projectUsers={projectUsers}
                                            handleUpdateTask={handleUpdateItem}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                            <Outlet
                                context={{ itemsList, projectUsers, users, handleUpdateItem }}
                            />
                        </>
                    )}
                </div>
            )}
            <Dialog open={openDialog?.kind == 'edit'} onOpenChange={() => setOpenDialog(null)}>
                <DialogContent className="sm:max-w-sm">
                    <form
                        key={openDialog?.task.id}
                        onSubmit={handleSubmit(handleEditTask)}
                        className="grid gap-6"
                    >
                        <DialogHeader>
                            <DialogTitle>Edit task</DialogTitle>
                            <DialogDescription>Change the title or description</DialogDescription>
                        </DialogHeader>
                        <FieldGroup>
                            <Field>
                                <Input
                                    {...register('title', { required: true })}
                                    id="title"
                                    placeholder="Task name"
                                />
                            </Field>
                            <Field>
                                <Textarea
                                    className="max-h-30"
                                    {...register('description')}
                                    id="description"
                                    placeholder="Add a description"
                                />
                            </Field>
                        </FieldGroup>
                        <DialogFooter>
                            <DialogClose render={<Button variant="outline">Cancel</Button>} />
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <AlertDialog
                open={openDialog?.kind == 'delete'}
                onOpenChange={() => setOpenDialog(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you sure you want to delete the task ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete task and
                            subtask this task.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleRemoveTask()}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
