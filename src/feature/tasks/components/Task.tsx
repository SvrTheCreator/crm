import type { Priority, Status, TaskType, UpdateField, UpdateValue, UsersType } from '../types.ts';
import { Fragment, useState } from 'react';
import { SubtasksList } from '../../subtasks/components/SubtasksList.tsx';

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

export function Task(props: Props) {
    const [openTaskId, setOpenTaskId] = useState<string | null>(null);

    const handleCurrentTask = (taskId: string) => {
        return openTaskId === taskId ? setOpenTaskId(null) : setOpenTaskId(taskId);
    };

    const currentUser = props.users.find((user) => user.id === props.task.assignee);
    const assigneeName = currentUser ? currentUser.name : 'Не выбран';

    return (
        <Fragment>
            <tr style={{ position: 'relative' }}>
                <td style={cell}>
                    <button onClick={() => props.handleRemoveTask(props.task.id)}>delete</button>
                </td>
                <td style={cell}>
                    <button
                        onClick={() => handleCurrentTask(props.task.id)}
                        style={{ textDecoration: 'underline', cursor: 'pointer' }}
                    >
                        {props.task.title}
                    </button>
                </td>
                <td style={cell}>{props.task.description}</td>
                <td style={cell}>{assigneeName}</td>
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
                <td style={cell}>{props.task.dueDate}</td>
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
