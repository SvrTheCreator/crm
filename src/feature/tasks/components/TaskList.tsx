import {
    type CreateTaskType,
    type SortField,
    type TaskType,
    type UpdateField,
    type UpdateValue,
} from '../types.ts';
import { useEffect, useState } from 'react';
import { AddTask } from './AddTask.tsx';
import { Task } from './Task.tsx';
import { supabase } from '../../../utils/supabase.ts';
import { useUsers } from '../../users/hooks/useUsers.ts';

interface SortConfig {
    field: SortField | null;
    order: boolean | null;
}

type Props = {
    projectId: string | null;
};

export function TaskList(props: Props) {
    const [taskList, setTaskList] = useState<Array<TaskType>>([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        field: null,
        order: null,
    });
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
    const { users } = useUsers();

    useEffect(() => {
        async function getTasks() {
            if (props.projectId === null) return;
            setLoading(true);
            const response = await supabase
                .from('tasks')
                .select()
                .order('created_at', { ascending: false })
                .eq('project_id', props.projectId);

            if (response.error) {
                setLoading(false);
                console.log(response.error);
                return;
            }

            if (response.data) {
                setLoading(false);
                setTaskList(response.data);
            }
        }
        getTasks();
    }, [props.projectId]);

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

    const sortedTaskList = [...taskList].sort((a, b) => {
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
                    {!taskList.length && 'Добавь новую задачу для этого проекта'}
                    {taskList.length > 0 && (
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
