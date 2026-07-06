import { useForm } from 'react-hook-form';
import type { TaskType } from '../types.ts';

type Props = {
    handleAddTask: (task: TaskType) => void;
    currentProjectId: string;
};

export function AddTask(props: Props) {
    const { register, handleSubmit, reset } = useForm<TaskType>();

    const handleCreateNewTask = (data: TaskType) => {
        const task: TaskType = {
            id: crypto.randomUUID(),
            projectId: props.currentProjectId,
            title: data.title,
            description: data.description,
            assignee: data.assignee,
            priority: data.priority,
            dueDate: data.dueDate,
            status: data.status,
        };

        props.handleAddTask(task);

        // console.log(task.id)
        reset();
    };

    return (
        <form onSubmit={handleSubmit(handleCreateNewTask)}>
            <div>
                <label htmlFor="title">Task Name</label>
                <input {...register('title', { required: true })} />
            </div>
            <div>
                <label htmlFor="description">Description</label>
                <input {...register('description', { required: true })} />
            </div>
            <div>
                <label htmlFor="assignee">assignee</label>
                <input {...register('assignee', { required: true })} />
            </div>
            <div>
                <label htmlFor="priority">priority</label>
                <select {...register('priority', { required: true })}>
                    <option value="">Select...</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>
            <div>
                <label htmlFor="dueDate">dueDate</label>
                <input type="date" {...register('dueDate', { required: true })} />
            </div>
            <div>
                <label htmlFor="status">status</label>
                <select {...register('status', { required: true })}>
                    <option value="">Select...</option>
                    <option value="To Do">To Do</option>
                    <option value="Done">Done</option>
                    <option value="In progress">In progress</option>
                </select>
            </div>
            <button type="submit">Add New Project</button>
        </form>
    );
}
