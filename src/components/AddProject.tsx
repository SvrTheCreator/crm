import type {dashboardProject} from "../dal/api.tsx";
import {useForm} from 'react-hook-form';

type Props = {
    handleAddProject: (project: dashboardProject) => void,
}

export function AddProject(props: Props) {
    const {register, handleSubmit, reset} = useForm()

    const addNewProject = (data, event) => {
        event?.preventDefault()
        const project: dashboardProject = {
            id: Date.now(),
            projectName: data.projectName,
            description: data.description,
            assignee: data.assignee,
            priority: data.priority,
            dueDate: data.dueDate,
            status: data.status,
        }
        //
        props.handleAddProject(project);

        console.log(data.ProjectName)
        reset()
    }


    return (
        <form onSubmit={handleSubmit(addNewProject)}>
            <div>
                <label htmlFor="projectName">ProjectName</label>
                <input {...register("projectName")} />
            </div>
            <div>
                <label htmlFor="description">Description</label>
                <input {...register("description")} />
            </div>
            <div>
                <label htmlFor="assignee">assignee</label>
                <input {...register("assignee")} />
            </div>
            <div>
                <label htmlFor="priority">priority</label>
                <input type {...register("priority")} />
            </div>
            <div>
                <label htmlFor="dueDate">dueDate</label>
                <input {...register("dueDate")} />
            </div>
            <div>
                <label htmlFor="status">status</label>
                <input {...register("status")} />
            </div>
            <button type="submit">Add New Project</button>
        </form>
    )
}