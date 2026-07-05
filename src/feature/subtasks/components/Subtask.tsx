import type { SubtaskType } from '../types.ts';
import type { Priority, Status, UpdateField } from '../../tasks/types.ts';

const cell = {
    maxWidth: '300px',
    overflow: 'hidden',
    border: '0.5px solid grey',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
};

type Props = {
    subtask: SubtaskType;
    handleDeleteSubtask: (id: string) => void;
    handleUpdateSubtask: (id: string, field: UpdateField, value: Status | Priority) => void;
};

export function Subtask(props: Props) {
    return (
        <>
            <td style={cell}>
                <button onClick={() => props.handleDeleteSubtask(props.subtask.id)}>delete</button>
            </td>
            <td style={cell}>{props.subtask.title}</td>
            <td style={cell}>{props.subtask.assignee}</td>
            <td style={cell}>
                <select
                    defaultValue={props.subtask.status as Status}
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
                <select
                    defaultValue={props.subtask.status as Status}
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
