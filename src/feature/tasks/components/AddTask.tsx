import { useForm } from 'react-hook-form';
import type { CreateTaskType, UsersType } from '../types.ts';

type Props = {
    handleAddTask: (task: CreateTaskType) => void;
    currentProjectId: string;
    users: UsersType[];
};

export function AddTask(props: Props) {
    const { register, handleSubmit, reset } = useForm<CreateTaskType>();
    // const [users, setUsers] = useState<Array<UsersType>>([]);
    //
    // useEffect(() => {
    //     async function getProfiles() {
    //         const response = await supabase.from('profiles').select();
    //
    //         if (response.error) {
    //             console.log(response.error);
    //             return;
    //         }
    //         if (response.data) {
    //             setUsers(response.data);
    //             console.log(response.data);
    //         }
    //     }
    //     getProfiles();
    // }, []);

    const handleCreateNewTask = (data: CreateTaskType) => {
        const task: CreateTaskType = {
            project_id: props.currentProjectId,
            title: data.title,
            description: data.description,
            assignee: data.assignee,
            priority: data.priority,
            dueDate: data.dueDate,
            status: data.status,
        };

        props.handleAddTask(task);

        console.log(task);
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
                <label htmlFor="assignee">Assignee</label>
                <select {...register('assignee', { required: true })}>
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
