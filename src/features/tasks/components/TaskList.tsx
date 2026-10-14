import { type CreateTaskType, type TaskType } from '../types.ts';
import { useState } from 'react';
import { AddTask } from './AddTask.tsx';
import { Task } from './Task.tsx';
import { createTask, readTasks, deleteTask, updateTask } from '../api.ts';
import { useUsers } from '../../users/hooks/useUsers.ts';
import { useCrud } from '@/shared/hooks/useCollection.ts';
import { useOutletContext, useParams } from 'react-router';
import { Spinner } from '@/components/ui/spinner.tsx';
import type { ContextType } from '@/pages/workspace/Workspace.tsx';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx';
import { Button } from '@/components/ui/button.tsx';
import type { SortField } from '@/shared/types.ts';

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
                'Choose a project'
            ) : error !== '' ? (
                error
            ) : loading ? (
                <div style={{ position: 'absolute', top: '50%', left: '50%' }}>
                    <Spinner className="size-10" />
                </div>
            ) : (
                <div>
                    <div className="flex justify-end items-center mb-5 ">
                        <Button
                            type="button"
                            size="lg"
                            className="cursor-pointer"
                            onClick={() => setIsAddItemOpen(!isAddItemOpen)}
                        >
                            Add task
                        </Button>
                    </div>
                    {isAddItemOpen && params.projectId && (
                        <AddTask
                            currentProjectId={params.projectId}
                            handleAddTask={handleAddItem}
                            users={users}
                            projectUsers={projectUsers}
                            isAddItemOpen={isAddItemOpen}
                            setIsAddItemOpen={setIsAddItemOpen}
                        />
                    )}
                    {!itemsList.length && 'Добавь новую задачу для этого проекта'}
                    {itemsList.length > 0 && (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead
                                            onClick={() => {
                                                handleConfig('title');
                                            }}
                                        >
                                            Task Name
                                        </TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Assignee</TableHead>
                                        <TableHead onClick={() => handleConfig('priority')}>
                                            Priority
                                        </TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead onClick={() => handleConfig('status')}>
                                            Status
                                        </TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
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
                                </TableBody>
                            </Table>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
