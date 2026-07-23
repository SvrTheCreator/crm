import { useForm } from 'react-hook-form';
import type { CreateTaskType, UsersType } from '../types.ts';
import { getCurrentDate } from '../../../utils/getCurrentDate.ts';

type Props = {
    handleAddTask: (task: CreateTaskType) => void;
    currentProjectId: string;
    users: UsersType[];
};

export function AddTask(props: Props) {
    const { register, handleSubmit, reset } = useForm<CreateTaskType>();

    const handleCreateNewTask = (data: CreateTaskType) => {
        const task: CreateTaskType = {
            project_id: props.currentProjectId,
            title: data.title,
            description: data.description,
            assignee: data.assignee === '' ? null : data.assignee,
            priority: data.priority,
            due_date: data.due_date === '' ? null : data.due_date,
            status: data.status,
        };

        props.handleAddTask(task);

        console.log(task);
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
                <input {...register('description')} />
            </div>
            <div>
                <label htmlFor="assignee">Assignee</label>
                <select {...register('assignee')}>
                    <option value="">Select...</option>
                    {props.users.map((item: UsersType) => {
                        return (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        );
                    })}
                </select>
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
                <input min={getCurrentDate()} type="date" {...register('due_date')} />
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
