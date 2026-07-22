import type { CreateSubtaskType } from '../types.ts';
import { useForm } from 'react-hook-form';
import type { UsersType } from '../../tasks/types.ts';
import { getCurrentDate } from '../../../utils/getCurrentDate.ts';

type Props = {
    taskId: string;
    users: UsersType[];
    handleAddSubtask: (newSubtask: CreateSubtaskType) => void;
};

export function AddSubtask(props: Props) {
    const { register, handleSubmit, reset } = useForm<CreateSubtaskType>();

    const handleCreateSubtask = (newSubtask: CreateSubtaskType) => {
        const subtask: CreateSubtaskType = {
            task_id: props.taskId,
            title: newSubtask.title,
            description: newSubtask.description === '' ? null : newSubtask.description,
            assignee: newSubtask.assignee === '' ? null : newSubtask.assignee,
            priority: newSubtask.priority,
            due_date: newSubtask.due_date === '' ? null : newSubtask.due_date,
            status: newSubtask.status,
        };

        props.handleAddSubtask(subtask);

        reset();
    };

    return (
        <form onSubmit={handleSubmit(handleCreateSubtask)}>
            <div>
                <label htmlFor="title">Subtask Name</label>
                <input {...register('title', { required: true })} id="title" type="text" />
            </div>
            <div>
                <label htmlFor="description">Description</label>
                <input {...register('description')} id="description" type="text" />
            </div>
            <div>
                <label htmlFor="assignee">assignee</label>
                <select {...register('assignee')} name="assignee">
                    <option value="">Не выбран</option>
                    {props.users.map((user: UsersType) => {
                        return (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        );
                    })}
                </select>
            </div>
            <div>
                <select {...register('priority', { required: true })}>
                    <option value="">Select priority...</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Low">Low</option>
                </select>
            </div>
            <div>
                <label htmlFor="due_date">Due date</label>
                <input min={getCurrentDate()} {...register('due_date')} type="date" />
            </div>
            <div>
                <label htmlFor="status">status</label>
                <select {...register('status', { required: true })}>
                    <option value="">Select status...</option>
                    <option value="To Do">To Do</option>
                    <option value="Done">Done</option>
                    <option value="In progress">In progress</option>
                </select>
            </div>
            <button type="submit">Create</button>
        </form>
    );
}
