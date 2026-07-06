import type { SubtaskType } from '../types.ts';
import { useForm } from 'react-hook-form';

type Props = {
    taskId: string;
    handleAddSubtask: (newSubtask: SubtaskType) => void;
};

export function AddSubtask(props: Props) {
    const { register, handleSubmit, reset } = useForm<SubtaskType>();

    const handleCreateSubtask = (newSubtask: SubtaskType) => {
        const subtask: SubtaskType = {
            id: crypto.randomUUID(),
            taskId: props.taskId,
            title: newSubtask.title,
            assignee: newSubtask.assignee,
            priority: newSubtask.priority,
            status: newSubtask.status,
        };

        props.handleAddSubtask(subtask);

        reset();
    };

    return (
        <form onSubmit={handleSubmit(handleCreateSubtask)}>
            <div>
                <label htmlFor="title">Title</label>
                <input {...register('title', { required: true })} id="title" type="text" />
            </div>
            <div>
                <label htmlFor="assignee">assignee</label>
                <input {...register('assignee', { required: true })} id="assignee" type="text" />
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
