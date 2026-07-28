import { type CreateTaskType, type SortField, type TaskType } from '../types.ts';
import { useState } from 'react';
import { AddTask } from './AddTask.tsx';
import { Task } from './Task.tsx';
import { createTask, readTasks, deleteTask, updateTask } from '../api.ts';
import { useCrud } from '../../../hooks/useCollection.ts';
import { useUsers } from '../../users/hooks/useUsers.ts';

interface SortConfig {
    field: SortField | null;
    order: boolean | null;
}

type Props = {
    projectId: string | null;
};

export function TaskList(props: Props) {
    const {
        itemsList,
        loading,
        error,
        isAddItemOpen,
        setIsAddItemOpen,
        handleAddItem,
        handleRemoveItem,
        handleUpdateItem,
    } = useCrud<TaskType, Props['projectId'], CreateTaskType>({
        readItems: readTasks,
        required_ID: props.projectId,
        createItem: createTask,
        deleteItem: deleteTask,
        updateItem: updateTask,
    });

    const { users } = useUsers();

    const [sortConfig, setSortConfig] = useState<SortConfig>({
        field: null,
        order: null,
    });

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
            {props.projectId === null ? (
                'Выбери проект'
            ) : error !== '' ? (
                error
            ) : loading ? (
                'Loading...'
            ) : (
                <div>
                    <div style={{ marginBottom: '12px' }}>
                        <button onClick={() => setIsAddItemOpen(!isAddItemOpen)}>Add task</button>
                        {isAddItemOpen && props.projectId && (
                            <AddTask
                                currentProjectId={props.projectId}
                                handleAddTask={handleAddItem}
                                users={users}
                            />
                        )}
                    </div>
                    {!itemsList.length && 'Добавь новую задачу для этого проекта'}
                    {itemsList.length > 0 && (
                        <>
                            <h2>Tasks</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th
                                            onClick={() => {
                                                handleConfig('title');
                                            }}
                                        >
                                            Task Name
                                        </th>
                                        <th>Description</th>
                                        <th>Assignee</th>
                                        <th onClick={() => handleConfig('priority')}>Priority</th>
                                        <th>Due Date</th>
                                        <th onClick={() => handleConfig('status')}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedTaskList.map((task: TaskType) => (
                                        <Task
                                            key={task.id}
                                            users={users}
                                            task={task}
                                            handleUpdateTask={handleUpdateItem}
                                            handleRemoveTask={handleRemoveItem}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
