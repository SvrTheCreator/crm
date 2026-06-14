import {type dashboardProject, projectsSyntra} from "../dal/api.tsx";
import {useState} from "react";

export function ProjectsTable() {
    const [projects, setProjects] = useState<Array<dashboardProject>>(projectsSyntra)


    const handleClick = () => {
        const newProject: dashboardProject = {
            id: Date.now(),
            projectName: 'new Project',
            description: 'new description',
            assignee: 'new assignee',
            priority: 'new priority',
            dueDate: 'new',
            status: 'to do',
            tasks: 0,
        }
        setProjects([...projects, newProject])
    }

    const handleRemove = (id: number) => {
        console.log(id)
        const projectsWithoutDeleted = projects.filter(el => {
            return el.id !== id
        })
        setProjects(projectsWithoutDeleted)
    }

    return (
        <div>
            <button onClick={handleClick}>Add project</button>
            {projects && <table>
                <thead>
                <tr>
                    <th>delete</th>
                    <th>Project Name</th>
                    <th>Description</th>
                    <th>Assignee</th>
                    <th>Priority</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Tasks</th>
                </tr>
                </thead>
                <tbody>
                {projects.map((project: dashboardProject) => (
                    <tr key={project.id}>
                        <td onClick={() => handleRemove(project.id)}>
                            delete
                        </td>
                        <td>{project.projectName}</td>
                        <td>{project.description}</td>
                        <td>{project.assignee}</td>
                        <td>{project.priority}</td>
                        <td>{project.dueDate}</td>
                        <td>{project.status}</td>
                        <td>{project.tasks}</td>
                    </tr>
                ))}
                </tbody>
            </table>}
        </div>
    )
}