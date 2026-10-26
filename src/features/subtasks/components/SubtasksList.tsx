import type { CreateSubtaskType, SubtaskType } from '../types.ts';
import { Subtask } from './Subtask.tsx';
import { AddSubtask } from './AddSubtask.tsx';
import { createSubtask, readSubtasks, deleteSubtask, updateSubtask } from '../api.ts';
import { useCrud } from '@/shared/hooks/useCollection.ts';
import type { UsersType } from '../../users/types.ts';
import { Spinner } from '@/components/ui/spinner.tsx';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx';
import { type ReactNode, useState } from 'react';
import type { EditedFieldType } from '@/features/tasks/types.ts';
import { useForm } from 'react-hook-form';
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
import { Textarea } from '@/components/ui/textarea.tsx';
import { Button } from '@/components/ui/button.tsx';
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
import type { ContextType } from '@/pages/workspace/Workspace.tsx';
import { useOutletContext } from 'react-router';

type Props = {
    taskId: string;
    users: UsersType[];
    projectUsers: UsersType[];
    // шапка задачи — рисуем её вместе со списком, чтобы во время загрузки был только спиннер
    children?: ReactNode;
};

export function SubtasksList(props: Props) {
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
    } = useCrud<SubtaskType, Props['taskId'], CreateSubtaskType>({
        itemName: 'Subtask',
        readItems: readSubtasks,
        required_ID: props.taskId,
        createItem: createSubtask,
        deleteItem: deleteSubtask,
        updateItem: updateSubtask,
    });

    const [openDialog, setOpenDialog] = useState<{
        kind: 'delete' | 'edit';
        subtask: SubtaskType;
    } | null>(null);

    const { projectUsers } = useOutletContext<ContextType>();
    const { register, handleSubmit } = useForm<EditedFieldType>();

    const handleEditSubtask = (data: EditedFieldType) => {
        if (openDialog === null) return;

        const changes: Partial<SubtaskType> = {};
        if (openDialog.subtask.title !== data.title) {
            changes.title = data.title;
        }
        if (openDialog.subtask.description !== data.description) {
            changes.description = data.description || null;
        }

        handleUpdateFields(openDialog.subtask.id, changes);
        setOpenDialog(null);
    };

    const handleRemoveSubtask = () => {
        if (openDialog === null) return;
        handleRemoveItem(openDialog?.subtask?.id);
        setOpenDialog(null);
    };

    return error !== '' ? (
        error
    ) : loading ? (
        <div className="flex justify-center py-20">
            <Spinner className="size-8 text-muted-foreground" />
        </div>
    ) : (
        <div className="grid gap-5">
            {props.children}
            <div className="flex justify-start items-center">
                <Button
                    type="button"
                    size="lg"
                    className="cursor-pointer"
                    onClick={() => setIsAddItemOpen(!isAddItemOpen)}
                >
                    Add subtask
                </Button>
            </div>
            {isAddItemOpen && (
                <AddSubtask
                    taskId={props.taskId}
                    users={props.users}
                    handleAddSubtask={handleCreateItem}
                    projectUsers={projectUsers}
                    isAddItemOpen={isAddItemOpen}
                    setIsAddItemOpen={setIsAddItemOpen}
                />
            )}
            {itemsList.length === 0 ? (
                <h2>No active subtasks</h2>
            ) : (
                <div className="overflow-x-auto">
                    <Table style={{ minWidth: '100%' }}>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Subtask Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Assignee</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Due date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {itemsList.map((subtask: SubtaskType) => (
                                <Subtask
                                    key={subtask.id}
                                    subtask={subtask}
                                    projectUsers={props.projectUsers}
                                    users={props.users}
                                    handleUpdateSubtask={handleUpdateItem}
                                    setOpenDialog={setOpenDialog}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
            <Dialog open={openDialog?.kind == 'edit'} onOpenChange={() => setOpenDialog(null)}>
                <DialogContent className="sm:max-w-sm max-h-[85vh] overflow-y-auto">
                    <form
                        key={openDialog?.subtask.id}
                        onSubmit={handleSubmit(handleEditSubtask)}
                        className="grid gap-6"
                    >
                        <DialogHeader>
                            <DialogTitle>Edit subtask</DialogTitle>
                            <DialogDescription>Change the title or description</DialogDescription>
                        </DialogHeader>
                        <FieldGroup>
                            <Field>
                                <Input
                                    {...register('title', { required: true })}
                                    id="title"
                                    name="title"
                                    placeholder={openDialog?.subtask.title}
                                    defaultValue={openDialog?.subtask.title}
                                />
                            </Field>
                            <Field>
                                <Textarea
                                    className="max-h-30"
                                    {...register('description')}
                                    id="description"
                                    name="description"
                                    placeholder={
                                        openDialog?.subtask.description === null
                                            ? 'add new description'
                                            : openDialog?.subtask.description
                                    }
                                />
                            </Field>
                        </FieldGroup>
                        <DialogFooter>
                            <DialogClose render={<Button variant="outline">Cancel</Button>} />
                            <Button onClick={() => handleEditSubtask} type="submit">
                                Save changes
                            </Button>
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
                            Are you sure you want to delete the subtask ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete subtask
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleRemoveSubtask()}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
