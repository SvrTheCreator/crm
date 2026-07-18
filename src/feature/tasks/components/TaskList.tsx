import {
    type CreateTaskType,
    type SortField,
    type TaskType,
    type UpdateField,
    type UpdateValue,
    type UsersType,
} from '../types.ts';
import { useEffect, useState } from 'react';
import { AddTask } from './AddTask.tsx';
import { Task } from './Task.tsx';
import { supabase } from '../../../utils/supabase.ts';

interface SortConfig {
    field: SortField | null;
    order: boolean | null;
}

type Props = {
    projectId: string | null;
};

export function TaskList(props: Props) {
    const [taskList, setTaskList] = useState<Array<TaskType>>([]);
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        field: null,
        order: null,
    });
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
    const [users, setUsers] = useState<Array<UsersType>>([]);

    useEffect(() => {
        async function getTasks() {
            const response = await supabase
                .from('tasks')
                .select()
                .order('created_at', { ascending: false });

            if (response.error) {
                console.log(response.error);
                return;
            }

            if (response.data) {
                setTaskList(response.data);
            }
        }
        getTasks();

        async function getProfiles() {
            const response = await supabase.from('profiles').select();

            if (response.error) {
                console.log(response.error);
                return;
            }
            if (response.data) {
                setUsers(response.data);
                // console.log(response.data);
            }
        }
        getProfiles();
    }, []);

    const currentProjectId = props.projectId;

    async function handleAddTask(task: CreateTaskType) {
        const response = await supabase.from('tasks').insert(task).select().single();

        if (response.error) {
            console.error(response.error);
            return;
        }

        if (response.data) {
            setTaskList([response.data, ...taskList]);
            setIsAddTaskOpen(false);
        }
    }

    async function handleRemoveTask(id: string) {
        const response = await supabase.from('tasks').delete().eq('id', id);
        if (response.error) {
            console.log(response.error);
            return;
        }

        setTaskList(taskList.filter((task) => task.id !== id));
    }

    async function handleUpdateTask(id: string, field: UpdateField, value: UpdateValue) {
        const response = await supabase
            .from('tasks')
            .update({ [field]: value })
            .eq('id', id);

        if (response.error) {
            console.log(response.error);
            return;
        }

        const updatedTasks = taskList.map((el) => {
            if (el.id === id) {
                return {
                    ...el,
                    [field]: value,
                };
            } else return el;
        });
        setTaskList(updatedTasks);
    }

    const handleConfig = (arg: SortField) => {
        setSortConfig((prev) => ({
            ...prev,
            field: arg,
            order: !prev.order,
        }));
    };

    const currentProjectTasks = taskList.filter((task) => {
        return task.project_id === props.projectId;
    });

    const sortedTaskList = [...currentProjectTasks].sort((a, b) => {
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
            {currentProjectId === null ? (
                'Выбери проект'
            ) : (
                <div>
                    <div style={{ marginBottom: '12px' }}>
                        <button onClick={() => setIsAddTaskOpen(!isAddTaskOpen)}>Add task</button>
                        {isAddTaskOpen && currentProjectId && (
                            <AddTask
                                currentProjectId={currentProjectId}
                                handleAddTask={handleAddTask}
                                users={users}
                            />
                        )}
                    </div>
                    {!currentProjectTasks.length && 'Добавь новую задачу для этого проекта'}
                    {currentProjectTasks.length > 0 && (
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
                                            task={task}
                                            users={users}
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
