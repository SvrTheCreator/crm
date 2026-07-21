import type { Priority, Status, TaskType, UpdateField, UpdateValue, UsersType } from '../types.ts';
import { Fragment, useState } from 'react';
import { SubtasksList } from '../../subtasks/components/SubtasksList.tsx';
import { getCurrentDate } from '../../../utils/getCurrentDate.ts';

const cell = {
    maxWidth: '300px',
    overflow: 'hidden',
    border: '0.5px solid grey',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
};

type Props = {
    task: TaskType;
    users: UsersType[];
    handleRemoveTask: (id: string) => void;
    handleUpdateTask: (id: string, field: UpdateField, value: UpdateValue) => void;
};

type EditedFieldType = {
    title: string;
    description: string;
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
    // const modifiedDate = props.task.due_date
    //     ? props.task.due_date.split('-').reverse().join('.')
    //     : 'Не выбрано';

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
            <tr style={{ position: 'relative' }}>
                <td style={cell}>
                    <button onClick={() => props.handleRemoveTask(props.task.id)}>delete</button>
                </td>
                <td style={cell}>
                    {isEdit ? (
                        <input
                            value={editedField.title}
                            name="title"
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
                </td>
                <td style={cell}>
                    {isEdit ? (
                        <input
                            value={editedField.description}
                            name="description"
                            onChange={(event) => {
                                setEditedField({
                                    ...editedField,
                                    [event.target.name]: event.target.value,
                                });
                            }}
                        />
                    ) : (
                        props.task.description
                    )}
                </td>
                <td style={cell}>
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
                        {props.users.map((item: UsersType) => {
                            return (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            );
                        })}
                    </select>
                </td>
                <td style={cell}>
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
                </td>
                <td style={cell}>
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
                </td>
                <td style={cell}>
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
                </td>
                <td>
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
                </td>
            </tr>

            {openTaskId === props.task.id && (
                <tr>
                    <td colSpan={7}>
                        <SubtasksList taskId={props.task.id} />
                    </td>
                </tr>
            )}
        </Fragment>
    );
}
