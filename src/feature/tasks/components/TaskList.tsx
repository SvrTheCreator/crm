import {
    type CreateTaskType,
    type SortField,
    type TaskType,
    type UpdateField,
    type UpdateValue,
} from '../types.ts';
import { useState } from 'react';
import { AddTask } from './AddTask.tsx';
import { Task } from './Task.tsx';
import { useUsers } from '../../users/hooks/useUsers.ts';
import { addTask, getTasks, removeTask, updateTask } from '../api.ts';
import { useLoad } from '../../../hooks/useLoad.ts';

interface SortConfig {
    field: SortField | null;
    order: boolean | null;
}

type Props = {
    projectId: string | null;
};

export function TaskList(props: Props) {
    const { itemsList, setItemsList, loading, error } = useLoad<TaskType, Props['projectId']>(
        getTasks,
        props.projectId,
    );

    const [sortConfig, setSortConfig] = useState<SortConfig>({
        field: null,
        order: null,
    });
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
    const { users } = useUsers();

    async function handleAddTask(task: CreateTaskType) {
        const data = await addTask(task);
        if (data) {
            setItemsList([data, ...itemsList]);
            setIsAddTaskOpen(false);
        }
    }

    async function handleRemoveTask(id: string) {
        const error = await removeTask(id);
        if (error === null) {
            setItemsList(itemsList.filter((task) => task.id !== id));
        }
    }

    async function handleUpdateTask(id: string, field: UpdateField, value: UpdateValue) {
        const error = await updateTask(id, field, value);
        if (error === null) {
            const updatedTasks = itemsList.map((el) => {
                if (el.id === id) {
                    return {
                        ...el,
                        [field]: value,
                    };
                } else return el;
            });
            setItemsList(updatedTasks);
        }
    }

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
                        <button onClick={() => setIsAddTaskOpen(!isAddTaskOpen)}>Add task</button>
                        {isAddTaskOpen && props.projectId && (
                            <AddTask
                                currentProjectId={props.projectId}
                                handleAddTask={handleAddTask}
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
                                            handleUpdateTask={handleUpdateTask}
                                            handleRemoveTask={handleRemoveTask}
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
