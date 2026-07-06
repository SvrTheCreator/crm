import { subtasksMock } from '../../../dal/api.tsx';
import { useState } from 'react';
import type { SubtaskType } from '../types.ts';
import { Subtask } from './Subtask.tsx';
import type { Priority, Status, UpdateField } from '../../tasks/types.ts';
import { AddSubtask } from './AddSubtask.tsx';

type Props = {
    taskId: string;
};

export function SubtasksList(props: Props) {
    const [subtasksList, setSubtasksList] = useState<Array<SubtaskType>>(subtasksMock);
    const [addSubtaskOpen, setAddSubtaskOpen] = useState<boolean>(false);

    const currentTaskSubtasks = subtasksList.filter((subtask: SubtaskType) => {
        return subtask.taskId === props.taskId;
    });

    const handleDeleteSubtask = (id: string) => {
        const subtasksWithoutDeleted = subtasksList.filter((subtask) => {
            return subtask.id !== id;
        });

        setSubtasksList(subtasksWithoutDeleted);
    };

    const handleUpdateSubtask = (id: string, field: UpdateField, value: Status | Priority) => {
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
        console.log(id, field, value);
        console.log(updateSubtask);
    };

    const handleAddSubtask = (newSubtask: SubtaskType) => {
        setSubtasksList([...subtasksList, newSubtask]);
        setAddSubtaskOpen(false);
    };

    return (
        <div style={{ marginLeft: '50px', padding: '20px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setAddSubtaskOpen(!addSubtaskOpen)}>Add subtask</button>
            </div>
            {addSubtaskOpen && (
                <AddSubtask taskId={props.taskId} handleAddSubtask={handleAddSubtask} />
            )}
            {currentTaskSubtasks.length === 0 ? (
                'Нет активных подзадач'
            ) : (
                <table style={{ minWidth: '100%' }}>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Subtask Name</th>
                            <th>Assignee</th>
                            <th>Priority</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTaskSubtasks.map((subtask: SubtaskType) => (
                            <tr key={subtask.id}>
                                <Subtask
                                    subtask={subtask}
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
