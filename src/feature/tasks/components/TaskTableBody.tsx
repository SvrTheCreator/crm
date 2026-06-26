import type {Priority, Status, Task, UpdateTaskField, UpdateTaskValue} from "../types.ts";

const cell = {
    maxWidth: '300px',
    overflow: 'hidden',
    border: '0.5px solid grey',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
};

type Props = {
    sortedProjects: Task[];
    handleRemoveTask: (id: string) => void;
    handleUpdateTask: (id: string, field: UpdateTaskField, value: UpdateTaskValue) => void;
}


export function TaskTableBody(props: Props) {


    return (
        <tbody>
        {props.sortedProjects.map((project: Task) => (
            <tr key={project.id}>
                <td style={cell}>
                    <button onClick={() => props.handleRemoveTask(project.id)}>delete</button>
                </td>
                <td style={cell}>{project.title}</td>
                <td style={cell}>{project.description}</td>
                <td style={cell}>{project.assignee}</td>
                <td style={cell}>
                    <select
                        defaultValue={project.priority}
                        onChange={(event) => props.handleUpdateTask(project.id, 'priority', event.target.value as Priority)}
                    >
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Low">Low</option>
                    </select>
                </td>
                <td style={cell}>{project.dueDate}</td>
                <td style={cell}>
                    <select
                        defaultValue={project.status}
                        onChange={(event) => props.handleUpdateTask(project.id, 'status', event.target.value as Status)}
                    >
                        <option value="To Do">To Do</option>
                        <option value="Done">Done</option>
                        <option value="In progress">In progress</option>
                    </select>
                </td>
            </tr>
        ))}
        </tbody>
    )
}