import {type dashboardProject, projectsSyntra} from "../dal/api.tsx";
import {useState} from "react";
import {AddProject} from "./AddProject.tsx";

interface SortConfig {
    field: keyof dashboardProject | null;
    order: boolean | null;
}

export function ProjectsTable() {
    const [projects, setProjects] = useState<Array<dashboardProject>>(projectsSyntra)
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        field: null,
        order: null
    })
    const [popup, togglePopup] = useState(false)

    const cell = {
        maxWidth: '300px',
        overflow: 'hidden',
        border: '0.5px solid grey',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    };

    const handleAddProject = (project: dashboardProject) => {
        setProjects([...projects, project])
    }

    const handleRemove = (id: number) => {
        const projectsWithoutDeleted = projects.filter(el => {
            return el.id !== id
        })
        setProjects(projectsWithoutDeleted)
    }

    const handleConfig = (arg: 'priority' | 'projectName' | 'status') => {
        setSortConfig(prev => ({
                ...prev,
                field: arg,
                order: !prev.order
            })
        )

        console.log(sortConfig)
    }

    const sortedProjects = [...projects].sort((a, b) => {
        if (!sortConfig.field) return 0

        const aValue = a[sortConfig.field]
        const bValue = b[sortConfig.field]

        return sortConfig.order
            ? aValue.toString().localeCompare(bValue.toString(), undefined, {
                numeric: true,
                sensitivity: "base"
            })
            : bValue.toString().localeCompare(aValue.toString(), undefined, {
                numeric: true,
                sensitivity: "base"
            })
    })

    return (
        <div>
            <button onClick={() => togglePopup(!popup)}>Add project</button>
            {popup && <AddProject handleAddProject={handleAddProject}/>}
            {projects && <table>
                <thead>
                <tr>
                    <th></th>
                    <th onClick={() => {
                        handleConfig('projectName')
                    }
                    }>Project Name
                    </th>
                    <th>Description</th>
                    <th>Assignee</th>
                    <th onClick={() => handleConfig('priority')}>Priority</th>
                    <th>Due Date</th>
                    <th onClick={() => handleConfig('status')}>Status</th>
                    {/*<th onClick={() => handleConfig('tasks')}>Tasks</th>*/}
                </tr>
                </thead>
                <tbody>
                {sortedProjects.map((project: dashboardProject) => (
                    <tr key={project.id}>
                        <td style={cell}>
                            <button onClick={() => handleRemove(project.id)}>delete</button>
                        </td>
                        <td style={cell}>{project.projectName}</td>
                        <td style={cell}>{project.description}</td>
                        <td style={cell}>{project.assignee}</td>
                        <td style={cell}>{project.priority}</td>
                        <td style={cell}>{project.dueDate}</td>
                        <td style={cell}>{project.status}</td>
                        {/*<td style={cell}>{project.tasks}</td>*/}
                    </tr>
                ))}
                </tbody>
            </table>}
        </div>
    )
}