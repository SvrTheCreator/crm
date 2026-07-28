import type { CreateSubtaskType, SubtaskType } from '../types.ts';
import { Subtask } from './Subtask.tsx';
import type { UsersType } from '../../tasks/types.ts';
import { AddSubtask } from './AddSubtask.tsx';
import { createSubtask, readSubtasks, deleteSubtask, updateSubtask } from '../api.ts';
import { useCrud } from '../../../hooks/useCollection.ts';

type Props = {
    taskId: string;
    users: UsersType[];
};

export function SubtasksList(props: Props) {
    const {
        itemsList,
        loading,
        error,
        isAddItemOpen,
        setIsAddItemOpen,
        handleAddItem,
        handleRemoveItem,
        handleUpdateItem,
    } = useCrud<SubtaskType, Props['taskId'], CreateSubtaskType>({
        readItems: readSubtasks,
        required_ID: props.taskId,
        createItem: createSubtask,
        deleteItem: deleteSubtask,
        updateItem: updateSubtask,
    });

    return error !== '' ? (
        error
    ) : loading ? (
        'Loading...'
    ) : (
        <div style={{ marginLeft: '50px', padding: '20px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setIsAddItemOpen(!isAddItemOpen)}>Add subtask</button>
            </div>
            {isAddItemOpen && (
                <AddSubtask
                    taskId={props.taskId}
                    users={props.users}
                    handleAddSubtask={handleAddItem}
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
                                    handleDeleteSubtask={handleRemoveItem}
                                    handleUpdateSubtask={handleUpdateItem}
                                />
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
