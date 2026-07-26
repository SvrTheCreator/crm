import { useState } from 'react';
import type { CreateSubtaskType, SubtaskType } from '../types.ts';
import { Subtask } from './Subtask.tsx';
import type { UpdateField, UpdateValue, UsersType } from '../../tasks/types.ts';
import { AddSubtask } from './AddSubtask.tsx';
import { addSubtask, deleteSubtask, getSubtasks, updateSubtask } from '../api.ts';
import { useLoad } from '../../../hooks/useLoad.ts';

type Props = {
    taskId: string;
    users: UsersType[];
};

export function SubtasksList(props: Props) {
    const [addSubtaskOpen, setAddSubtaskOpen] = useState<boolean>(false);

    const { itemsList, setItemsList, loading, error } = useLoad<SubtaskType, Props['taskId']>(
        getSubtasks,
        props.taskId,
    );

    async function handleAddSubtask(newSubtask: CreateSubtaskType) {
        const { data, error } = await addSubtask(newSubtask);

        if (data) {
            setItemsList([data, ...itemsList]);
            setAddSubtaskOpen(false);
        }

        if (error !== null) {
            console.log(error.message);
            setAddSubtaskOpen(false);
        }
    }

    async function handleDeleteSubtask(id: string) {
        const { error } = await deleteSubtask(id);

        if (error === null) {
            const subtasksWithoutDeleted = itemsList.filter((subtask) => {
                return subtask.id !== id;
            });

            setItemsList(subtasksWithoutDeleted);
        } else {
            console.log(error.message);
        }
    }

    async function handleUpdateSubtask(id: string, field: UpdateField, value: UpdateValue) {
        const { error } = await updateSubtask(id, field, value);

        if (error === null) {
            const updateSubtask = itemsList.map((subtask: SubtaskType) => {
                if (subtask.id === id) {
                    return {
                        ...subtask,
                        [field]: value,
                    };
                } else {
                    return subtask;
                }
            });
            setItemsList(updateSubtask);
        } else {
            console.log(error.message);
        }
    }

    return error !== '' ? (
        error
    ) : loading ? (
        'Loading...'
    ) : (
        <div style={{ marginLeft: '50px', padding: '20px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setAddSubtaskOpen(!addSubtaskOpen)}>Add subtask</button>
            </div>
            {addSubtaskOpen && (
                <AddSubtask
                    taskId={props.taskId}
                    users={props.users}
                    handleAddSubtask={handleAddSubtask}
                />
            )}
            {itemsList.length === 0 ? (
                'Нет активных подзадач'
            ) : (
                <table style={{ minWidth: '100%' }}>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Subtask Name</th>
                            <th>Description</th>
                            <th>Assignee</th>
                            <th>Priority</th>
                            <th>Due date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemsList.map((subtask: SubtaskType) => (
                            <tr key={subtask.id}>
                                <Subtask
                                    subtask={subtask}
                                    users={props.users}
                                    handleDeleteSubtask={handleDeleteSubtask}
                                    handleUpdateSubtask={handleUpdateSubtask}
                                />
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
