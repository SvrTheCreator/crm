import type { SubtaskType } from '../types.ts';
import type { Priority, Status, UpdateField, UpdateValue, UsersType } from '../../tasks/types.ts';
import { getCurrentDate } from '../../../utils/getCurrentDate.ts';

const cell = {
    maxWidth: '300px',
    overflow: 'hidden',
    border: '0.5px solid grey',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
};

type Props = {
    subtask: SubtaskType;
    users: UsersType[];
    handleDeleteSubtask: (id: string) => void;
    handleUpdateSubtask: (id: string, field: UpdateField, value: UpdateValue) => void;
};

export function Subtask(props: Props) {
    return (
        <>
            <td style={cell}>
                <button onClick={() => props.handleDeleteSubtask(props.subtask.id)}>delete</button>
            </td>
            <td style={cell}>{props.subtask.title}</td>
            <td style={cell}>
                {props.subtask.description ? props.subtask.description : 'Нет описания'}
            </td>
            <td style={cell}>
                <select
                    name="assignee"
                    defaultValue={props.subtask.assignee === null ? '' : props.subtask.assignee}
                    onChange={(event) => {
                        props.handleUpdateSubtask(
                            props.subtask.id,
                            'assignee',
                            event.target.value === '' ? null : event.target.value,
                        );
                    }}
                >
                    <option value="">Не выбран</option>
                    {props.users.map((user) => {
                        return (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        );
                    })}
                </select>
            </td>
            <td style={cell}>
                <select
                    defaultValue={props.subtask.priority as Priority}
                    onChange={(event) =>
                        props.handleUpdateSubtask(
                            props.subtask.id,
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
                    defaultValue={props.subtask.due_date == null ? '' : props.subtask.due_date}
                    type="date"
                    name="due_date"
                    onChange={(event) => {
                        props.handleUpdateSubtask(
                            props.subtask.id,
                            'due_date',
                            event.target.value === '' ? null : event.target.value,
                        );
                    }}
                />
            </td>
            <td style={cell}>
                <select
                    defaultValue={props.subtask.status}
                    onChange={(event) =>
                        props.handleUpdateSubtask(
                            props.subtask.id,
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
        </>
    );
}
