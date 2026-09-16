import { type CreateTaskType, type SortField, type TaskType } from '../types.ts';
import { useState } from 'react';
import { AddTask } from './AddTask.tsx';
import { Task } from './Task.tsx';
import { createTask, readTasks, deleteTask, updateTask } from '../api.ts';
import { useUsers } from '../../users/hooks/useUsers.ts';
import { useCrud } from '../../../shared/hooks/useCollection.ts';
import { useOutletContext, useParams } from 'react-router';
import type { ContextType } from '../../../pages/workspace/Workspace.tsx';

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
        handleAddItem,
        handleRemoveItem,
        handleUpdateItem,
    } = useCrud<TaskType, string | null, CreateTaskType>({
        readItems: readTasks,
        required_ID: params.projectId ?? null,
        createItem: createTask,
        deleteItem: deleteTask,
        updateItem: updateTask,
    });

    const { projectUsers } = useOutletContext<ContextType>();
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
            {params.projectId === null ? (
                'Выбери проект'
            ) : error !== '' ? (
                error
            ) : loading ? (
                'Loading...'
            ) : (
                <div>
                    <div style={{ marginBottom: '12px' }}>
                        <button onClick={() => setIsAddItemOpen(!isAddItemOpen)}>Add task</button>
                        {isAddItemOpen && params.projectId && (
                            <AddTask
                                currentProjectId={params.projectId}
                                handleAddTask={handleAddItem}
                                users={users}
                                projectUsers={projectUsers}
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
                                            projectUsers={projectUsers}
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
