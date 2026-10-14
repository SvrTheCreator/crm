import type { EditedFieldType, TaskType } from '../types.ts';
import { Fragment, useState } from 'react';
import { SubtasksList } from '../../subtasks/components/SubtasksList.tsx';
import { getCurrentDate } from '@/shared/utils/getCurrentDate.ts';
import type { UsersType } from '../../users/types.ts';
import { TableCell, TableRow } from '@/components/ui/table.tsx';
import type { Priority, Status, UpdateField, UpdateValue } from '@/shared/types.ts';

type Props = {
    task: TaskType;
    users: UsersType[];
    projectUsers: UsersType[];
    handleRemoveTask: (id: string) => void;
    handleUpdateTask: (id: string, field: UpdateField, value: UpdateValue) => void;
};

export function Task(props: Props) {
    const [openTaskId, setOpenTaskId] = useState<string | null>(null);
    const [isEdit, setIsEdit] = useState(false);
    const [editedField, setEditedField] = useState<EditedFieldType>({
        title: props.task.title,
        description: props.task.description,
    });
    const handleCurrentTask = (taskId: string) => {
        return openTaskId === taskId ? setOpenTaskId(null) : setOpenTaskId(taskId);
    };

    const currentUser = props.users.find((user) => user.id === props.task.assignee);

    const handleFieldChange = () => {
        if (props.task.title !== editedField.title) {
            props.handleUpdateTask(props.task.id, 'title', editedField.title);
        }
        if (props.task.description !== editedField.description) {
            props.handleUpdateTask(props.task.id, 'description', editedField.description);
        }
        setIsEdit(false);
    };

    return (
        <Fragment>
            <TableRow style={{ position: 'relative' }}>
                <TableCell>
                    {isEdit ? (
                        <input
                            value={editedField.title}
                            name="title"
                            onBlur={handleFieldChange}
                            onChange={(event) => {
                                setEditedField({
                                    ...editedField,
                                    [event.target.name]: event.target.value,
                                });
                            }}
                        />
                    ) : (
                        <button
                            onClick={() => handleCurrentTask(props.task.id)}
                            style={{ textDecoration: 'underline', cursor: 'pointer' }}
                        >
                            {props.task.title}
                        </button>
                    )}
                </TableCell>
                <TableCell>
                    {isEdit ? (
                        <input
                            value={editedField.description === null ? '' : editedField.description}
                            name="description"
                            onBlur={handleFieldChange}
                            onChange={(event) => {
                                setEditedField({
                                    ...editedField,
                                    [event.target.name]: event.target.value,
                                });
                            }}
                        />
                    ) : props.task.description ? (
                        props.task.description
                    ) : (
                        'Нет описания'
                    )}
                </TableCell>
                <TableCell>
                    <select
                        onChange={(event) => {
                            props.handleUpdateTask(
                                props.task.id,
                                'assignee',
                                event.target.value === '' ? null : event.target.value,
                            );
                        }}
                        defaultValue={currentUser ? currentUser.id : ''}
                    >
                        <option value="">Не выбран</option>
                        {props.projectUsers.map((item: UsersType) => {
                            return (
                                <option key={item.id} value={item.id}>
                                    {`${item.first_name} ${item.last_name}`}
                                </option>
                            );
                        })}
                    </select>
                </TableCell>
                <TableCell>
                    <select
                        defaultValue={props.task.priority}
                        onChange={(event) =>
                            props.handleUpdateTask(
                                props.task.id,
                                'priority',
                                event.target.value as Priority,
                            )
                        }
                    >
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Low">Low</option>
                    </select>
                </TableCell>
                <TableCell>
                    <input
                        min={getCurrentDate()}
                        type="date"
                        defaultValue={props.task.due_date === null ? '' : props.task.due_date}
                        onChange={(event) => {
                            props.handleUpdateTask(
                                props.task.id,
                                'due_date',
                                event.target.value === '' ? null : event.target.value,
                            );
                        }}
                    />
                    {/*{modifiedDate}*/}
                </TableCell>
                <TableCell>
                    <select
                        defaultValue={props.task.status}
                        onChange={(event) =>
                            props.handleUpdateTask(
                                props.task.id,
                                'status',
                                event.target.value as Status,
                            )
                        }
                    >
                        <option value="To Do">To Do</option>
                        <option value="Done">Done</option>
                        <option value="In progress">In progress</option>
                    </select>
                </TableCell>
                <TableCell>
                    {isEdit ? (
                        <div>
                            <button onClick={() => handleFieldChange()}>💾</button>
                            <button
                                onClick={() => {
                                    setEditedField({
                                        title: props.task.title,
                                        description: props.task.description,
                                    });
                                    setIsEdit(false);
                                }}
                            >
                                ❌
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setIsEdit(true)}>✏️</button>
                    )}
                </TableCell>
                {/*<TableCell >*/}
                {/*    <button onClick={() => props.handleRemoveTask(props.task.id)}>delete</button>*/}
                {/*</TableCell>*/}
            </TableRow>

            {openTaskId === props.task.id && (
                <tr>
                    <td colSpan={7}>
                        <SubtasksList users={props.users} taskId={props.task.id} />
                    </td>
                </tr>
            )}
        </Fragment>
    );
}
