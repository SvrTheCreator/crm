import { useEffect, useState } from 'react';
import type { CreateSubtaskType, SubtaskType } from '../types.ts';
import { Subtask } from './Subtask.tsx';
import type { UpdateField, UpdateValue, UsersType } from '../../tasks/types.ts';
import { AddSubtask } from './AddSubtask.tsx';
import { supabase } from '../../../utils/supabase.ts';

type Props = {
    taskId: string;
    users: UsersType[];
};

export function SubtasksList(props: Props) {
    const [subtasksList, setSubtasksList] = useState<Array<SubtaskType>>([]);
    const [addSubtaskOpen, setAddSubtaskOpen] = useState<boolean>(false);

    useEffect(() => {
        async function getSubtasks() {
            const response = await supabase
                .from('subtasks')
                .select()
                .order('created_at', { ascending: false });
            if (response.error) {
                console.log(response.error);
                return;
            }
            if (response.data) setSubtasksList(response.data);
        }
        getSubtasks();
    }, []);

    const currentTaskSubtasks = subtasksList.filter((subtask: SubtaskType) => {
        return subtask.task_id === props.taskId;
    });

    async function handleAddSubtask(newSubtask: CreateSubtaskType) {
        const response = await supabase.from('subtasks').insert(newSubtask).select().single();
        if (response.error) {
            console.log(response.error);
            return;
        }
        if (response.data) {
            setSubtasksList([response.data, ...subtasksList]);
            setAddSubtaskOpen(false);
        }
    }

    async function handleDeleteSubtask(id: string) {
        const response = await supabase.from('subtasks').delete().eq('id', id);

        if (response.error) {
            console.log(response.error);
            return;
        }

        const subtasksWithoutDeleted = subtasksList.filter((subtask) => {
            return subtask.id !== id;
        });

        setSubtasksList(subtasksWithoutDeleted);
    }

    async function handleUpdateSubtask(id: string, field: UpdateField, value: UpdateValue) {
        const response = await supabase
            .from('subtasks')
            .update({ [field]: value })
            .eq('id', id);

        if (response.error) {
            console.log(response.error);
            return;
        }

        const updateSubtask = subtasksList.map((subtask: SubtaskType) => {
            if (subtask.id === id) {
                return {
                    ...subtask,
                    [field]: value,
                };
            } else {
                return subtask;
            }
        });
        setSubtasksList(updateSubtask);
    }

    return (
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
            {currentTaskSubtasks.length === 0 ? (
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
                        {currentTaskSubtasks.map((subtask: SubtaskType) => (
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
